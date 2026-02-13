import { useState, useEffect } from "react";
import TaskColumn from "./TaskColumn";
import { 
  getGroupedTasksAPI, 
  updateTaskAPI,
  deleteTaskAPI 
} from "../../features/tasks/taskAPI";

export default function TaskBoard({ projectId }) {
  const [groupedTasks, setGroupedTasks] = useState({
    todo: [],
    "in-progress": [],
    done: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getGroupedTasksAPI(projectId);
      setGroupedTasks(res.grouped);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskAPI(taskId, { status: newStatus });
      
      // Update local state immediately for better UX
      setGroupedTasks(prev => {
        const newGrouped = { ...prev };
        
        // Find and remove task from all columns
        Object.keys(newGrouped).forEach(status => {
          newGrouped[status] = newGrouped[status].filter(t => t._id !== taskId);
        });
        
        // Find the task from previous state
        let taskToMove = null;
        Object.values(prev).forEach(tasks => {
          const found = tasks.find(t => t._id === taskId);
          if (found) taskToMove = { ...found, status: newStatus };
        });
        
        // Add to new status column
        if (taskToMove) {
          newGrouped[newStatus] = [taskToMove, ...newGrouped[newStatus]];
        }
        
        return newGrouped;
      });
    } catch (error) {
      console.error("Failed to update task status:", error);
      fetchTasks(); // Revert on error
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTaskAPI(taskId);
      
      // Update local state
      setGroupedTasks(prev => {
        const newGrouped = { ...prev };
        Object.keys(newGrouped).forEach(status => {
          newGrouped[status] = newGrouped[status].filter(t => t._id !== taskId);
        });
        return newGrouped;
      });
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleQuickMove = (taskId, direction) => {
    const statusFlow = {
      'todo': 'in-progress',
      'in-progress': 'done',
      'done': 'archived'
    };

    const reverseFlow = {
      'in-progress': 'todo',
      'done': 'in-progress'
    };

    let newStatus;
    if (direction === 'forward') {
      newStatus = statusFlow[findTaskStatus(taskId)];
    } else {
      newStatus = reverseFlow[findTaskStatus(taskId)];
    }

    if (newStatus) {
      handleStatusChange(taskId, newStatus);
    }
  };

  const findTaskStatus = (taskId) => {
    for (const [status, tasks] of Object.entries(groupedTasks)) {
      if (tasks.some(t => t._id === taskId)) {
        return status;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-gray-600">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <TaskColumn
        title="To Do"
        status="todo"
        tasks={groupedTasks.todo}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteTask}
        onQuickMove={handleQuickMove}
        nextStatus="in-progress"
        prevStatus={null}
        nextLabel="Start"
      />
      <TaskColumn
        title="In Progress"
        status="in-progress"
        tasks={groupedTasks["in-progress"]}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteTask}
        onQuickMove={handleQuickMove}
        nextStatus="done"
        prevStatus="todo"
        nextLabel="Complete"
        prevLabel="Back"
      />
      <TaskColumn
        title="Done"
        status="done"
        tasks={groupedTasks.done}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteTask}
        onQuickMove={handleQuickMove}
        nextStatus={null}
        prevStatus="in-progress"
        prevLabel="Reopen"
      />
    </div>
  );
}