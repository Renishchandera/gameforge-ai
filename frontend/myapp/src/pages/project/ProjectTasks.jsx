import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router";
import TaskBoard from "../../components/tasks/TaskBoard";
import {
  createTaskAPI,
  getGroupedTasksAPI
} from "../../features/tasks/taskAPI";

export default function ProjectTasks() {
  const { projectId } = useParams();
  const { project, refreshProject } = useOutletContext();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
    dueDate: ""
  });
  const [isCreating, setIsCreating] = useState(false);
  const [taskStats, setTaskStats] = useState({ total: 0, todo: 0, inProgress: 0, done: 0 });

  useEffect(() => {
    fetchTaskStats();
  }, [projectId]);

  const fetchTaskStats = async () => {
    try {
      const res = await getGroupedTasksAPI(projectId);
      const grouped = res.grouped;
      setTaskStats({
        total: (grouped.todo?.length || 0) + (grouped['in-progress']?.length || 0) + (grouped.done?.length || 0),
        todo: grouped.todo?.length || 0,
        inProgress: grouped['in-progress']?.length || 0,
        done: grouped.done?.length || 0
      });
    } catch (error) {
      console.error("Failed to fetch task stats:", error);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title.trim()) return;

    try {
      setIsCreating(true);
      await createTaskAPI(projectId, newTask);
      setNewTask({ title: "", description: "", priority: "medium", dueDate: "" });
      setShowCreateForm(false);
      await fetchTaskStats();
      // Refresh the task board
      window.location.reload(); // Simple solution - you can also use a state management solution
    } catch (error) {
      console.error("Failed to create task:", error);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>📋</span> Task Board
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Manage and track tasks for <span className="font-semibold">{project?.name}</span>
          </p>
        </div>
        
        {/* Task Stats */}
        <div className="flex gap-3 text-sm">
          <div className="bg-blue-50 px-3 py-2 rounded-lg">
            <span className="text-blue-600 font-semibold">{taskStats.todo}</span>
            <span className="text-gray-600 ml-1">To Do</span>
          </div>
          <div className="bg-yellow-50 px-3 py-2 rounded-lg">
            <span className="text-yellow-600 font-semibold">{taskStats.inProgress}</span>
            <span className="text-gray-600 ml-1">In Progress</span>
          </div>
          <div className="bg-green-50 px-3 py-2 rounded-lg">
            <span className="text-green-600 font-semibold">{taskStats.done}</span>
            <span className="text-gray-600 ml-1">Done</span>
          </div>
        </div>
      </div>

      {/* Create Task Button / Form */}
      {!showCreateForm ? (
        <button
          onClick={() => setShowCreateForm(true)}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg py-4 px-6 text-gray-500 hover:border-gray-400 hover:text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="font-medium">Add New Task</span>
        </button>
      ) : (
        <div className="bg-white border rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
            Create New Task
          </h3>
          
          <div className="space-y-4">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Task Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g., Design character sprites"
                value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                className="w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                autoFocus
              />
            </div>

            {/* Description Textarea */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-gray-400 text-xs">(optional)</span>
              </label>
              <textarea
                placeholder="Add details about this task..."
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                rows={3}
                className="w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow resize-none"
              />
            </div>

            {/* Priority and Due Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="low">🟢 Low</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="high">🔴 High</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTask}
                disabled={!newTask.title.trim() || isCreating}
                className="px-6 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Create Task
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task Board */}
      <div className="bg-white rounded-lg border p-6">
        <TaskBoard projectId={projectId} />
      </div>
    </div>
  );
}