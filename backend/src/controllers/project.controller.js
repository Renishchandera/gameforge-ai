const Project = require("../models/Project");
const Idea = require("../models/Idea");

const normalizeToArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};


/**
 * 1️⃣ CREATE PROJECT MANUALLY
 */
exports.createProjectManual = async (req, res) => {
  try {
    const {
      name,
      description,
      genres,
      platforms,
      targetAudience,
      coreMechanic,
      artStyle,
      monetization
    } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Project name is required"
      });
    }

    const project = await Project.create({
      name,
      description,
      genres: normalizeToArray(req.body.genres),
      platforms: normalizeToArray(req.body.platforms),
      targetAudience,
      coreMechanic,
      artStyle,
      monetization,
      owner: req.user.id
    });

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    console.error("Create manual project error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create project"
    });
  }
};

/**
 * 2️⃣ CREATE PROJECT FROM IDEA
 */
exports.createProjectFromIdea = async (req, res) => {
  try {
    const { ideaId } = req.params;

    const idea = await Idea.findOne({
      _id: ideaId,
      createdBy: req.user.id
    });

    if (!idea) {
      return res.status(404).json({
        success: false,
        message: "Idea not found"
      });
    }

    if (idea.isConvertedToProject) {
      return res.status(400).json({
        success: false,
        message: "Idea already converted to a project"
      });
    }

    // Handle both old and new data formats
    const project = await Project.create({
      name: idea.title || "Untitled Project",
      description: idea.content.slice(0, 200),
      // Support both genres (array) and genre (string)
      genres: idea.genres || (idea.genre ? [idea.genre] : []),
      // Support both platforms (array) and platform (string)
      platforms: idea.platforms || (idea.platform ? [idea.platform] : []),
      targetAudience: idea.targetAudience,
      coreMechanic: idea.coreMechanic,
      artStyle: idea.artStyle,
      monetization: idea.monetization,
      sourceIdea: idea._id,
      owner: req.user.id
    });

    idea.isConvertedToProject = true;
    await idea.save();

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    console.error("Create project from idea error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create project from idea"
    });
  }
};
/**
 * GET ALL PROJECTS
 */
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id })
      .sort({ updatedAt: -1 });

    res.json({
      success: true,
      projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch projects"
    });
  }
};

/**
 * GET PROJECT BY ID
 */
exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      owner: req.user.id
    }).populate("sourceIdea");

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch project"
    });
  }
};

/**
 * UPDATE PROJECT
 */
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      req.body,
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update project"
    });
  }
};

/**
 * DELETE PROJECT
 */
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({
      success: true,
      message: "Project deleted successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete project"
    });
  }
};


// controllers/project.controller.js - Add this new method

/**
 * UPDATE PROJECT STATUS ONLY
 * PATCH /projects/:id/status
 */
exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ["concept", "pre-production", "production", "paused", "released"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value"
      });
    }

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { status },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found"
      });
    }

    res.json({
      success: true,
      project
    });
  } catch (error) {
    console.error("Update project status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update project status"
    });
  }
};

/**
 * GET PROJECT STATISTICS
 * GET /projects/:id/stats
 */
exports.getProjectStats = async (req, res) => {
  try {
    const projectId = req.params.id;
    
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

    // Get task statistics
    const Task = require("../models/Task");
    const taskStats = await Task.aggregate([
      { $match: { project: project._id } },
      { 
        $group: {
          _id: "$status",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format stats
    const stats = {
      total: 0,
      todo: 0,
      inProgress: 0,
      done: 0,
      byPriority: {
        low: 0,
        medium: 0,
        high: 0
      }
    };

    taskStats.forEach(stat => {
      if (stat._id === "todo") stats.todo = stat.count;
      if (stat._id === "in-progress") stats.inProgress = stat.count;
      if (stat._id === "done") stats.done = stat.count;
    });
    
    stats.total = stats.todo + stats.inProgress + stats.done;

    // Get priority stats
    const priorityStats = await Task.aggregate([
      { $match: { project: project._id } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 }
        }
      }
    ]);

    priorityStats.forEach(stat => {
      if (stat._id === "low") stats.byPriority.low = stat.count;
      if (stat._id === "medium") stats.byPriority.medium = stat.count;
      if (stat._id === "high") stats.byPriority.high = stat.count;
    });

    // Calculate completion percentage
    stats.completionPercentage = stats.total > 0 
      ? Math.round((stats.done / stats.total) * 100) 
      : 0;

    res.json({
      success: true,
      stats,
      project
    });
  } catch (error) {
    console.error("Get project stats error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch project statistics"
    });
  }
};