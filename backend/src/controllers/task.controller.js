const Task = require("../models/Task");
const Project = require("../models/Project");

/**
 * CREATE TASK
 * POST /projects/:projectId/tasks
 */
exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required"
      });
    }

    // 1️⃣ Verify project ownership
    const project = await Project.findOne({
      _id: projectId,
      owner: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // 2️⃣ Create task
    const task = await Task.create({
      project: projectId,
      title,
      description,
      priority,
      dueDate
    });

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    console.error("Create task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create task"
    });
  }
};

/**
 * GET ALL TASKS FOR A PROJECT
 * GET /projects/:projectId/tasks
 */
exports.getProjectTasks = async (req, res) => {
  try {
    const { projectId } = req.params;

    // 1️⃣ Verify project ownership
    const project = await Project.findOne({
      _id: projectId,
      owner: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    // 2️⃣ Fetch tasks
    const tasks = await Task.find({ project: projectId })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tasks
    });
  } catch (error) {
    console.error("Get tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks"
    });
  }
};

/**
 * UPDATE TASK
 * PUT /tasks/:taskId
 */
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // 1️⃣ Find task
    const task = await Task.findById(taskId).populate("project");

    if (!task || task.project.owner.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    // 2️⃣ Update allowed fields
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      task: updatedTask
    });
  } catch (error) {
    console.error("Update task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update task"
    });
  }
};

/**
 * DELETE TASK
 * DELETE /tasks/:taskId
 */
exports.deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId).populate("project");

    if (!task || task.project.owner.toString() !== req.user.id) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: "Task deleted successfully"
    });
  } catch (error) {
    console.error("Delete task error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete task"
    });
  }
};


// controllers/task.controller.js - Add these new methods

/**
 * BATCH UPDATE TASKS STATUS
 * PATCH /tasks/batch/status
 */
exports.batchUpdateTaskStatus = async (req, res) => {
  try {
    const { taskIds, status } = req.body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Task IDs array is required"
      });
    }

    // Verify all tasks belong to user's projects
    const tasks = await Task.find({ _id: { $in: taskIds } }).populate("project");
    
    const unauthorized = tasks.some(task => 
      task.project.owner.toString() !== req.user.id
    );

    if (unauthorized) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update some tasks"
      });
    }

    // Update all tasks
    await Task.updateMany(
      { _id: { $in: taskIds } },
      { $set: { status } }
    );

    const updatedTasks = await Task.find({ _id: { $in: taskIds } });

    res.json({
      success: true,
      tasks: updatedTasks
    });
  } catch (error) {
    console.error("Batch update tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update tasks"
    });
  }
};

/**
 * GET TASKS GROUPED BY STATUS
 * GET /projects/:projectId/tasks/grouped
 */
exports.getTasksGroupedByStatus = async (req, res) => {
  try {
    const { projectId } = req.params;

    // Verify project ownership
    const project = await Project.findOne({
      _id: projectId,
      owner: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    const tasks = await Task.find({ project: projectId })
      .sort({ priority: -1, createdAt: -1 });

    // Group tasks by status
    const grouped = {
      todo: tasks.filter(t => t.status === "todo"),
      "in-progress": tasks.filter(t => t.status === "in-progress"),
      done: tasks.filter(t => t.status === "done")
    };

    res.json({
      success: true,
      grouped,
      total: tasks.length
    });
  } catch (error) {
    console.error("Get grouped tasks error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch tasks"
    });
  }
};