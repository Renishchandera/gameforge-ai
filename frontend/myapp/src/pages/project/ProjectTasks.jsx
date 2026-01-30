import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router";
import {
  getProjectTasksAPI,
  createTaskAPI,
  updateTaskAPI,
  deleteTaskAPI
} from "../../features/tasks/taskAPI";

export default function ProjectTasks() {
  const { projectId } = useParams();
  const { project } = useOutletContext();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium"
  });

  useEffect(() => {
    fetchTasks();
  }, [projectId]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await getProjectTasksAPI(projectId);
      setTasks(res.tasks);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async () => {
    if (!newTask.title) return;

    try {
      const res = await createTaskAPI(projectId, newTask);
      setTasks((prev) => [res.task, ...prev]);
      setNewTask({ title: "", description: "", priority: "medium" });
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const res = await updateTaskAPI(taskId, { status });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.task : t))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await deleteTaskAPI(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold">Tasks</h2>
        <p className="text-sm text-gray-600">
          Manage tasks for <strong>{project.name}</strong>
        </p>
      </div>

      {/* Create Task */}
      <div className="border rounded-lg bg-white p-4 space-y-3">
        <input
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) =>
            setNewTask({ ...newTask, title: e.target.value })
          }
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <textarea
          placeholder="Description (optional)"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          rows={2}
          className="w-full border rounded px-3 py-2 text-sm"
        />

        <div className="flex justify-between items-center">
          <select
            value={newTask.priority}
            onChange={(e) =>
              setNewTask({ ...newTask, priority: e.target.value })
            }
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
            onClick={handleCreateTask}
            className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800 text-sm"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <p>Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-500">No tasks yet</p>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------ TASK ITEM ------------------ */

function TaskItem({ task, onStatusChange, onDelete }) {
  return (
    <div className="border rounded p-4 bg-white flex justify-between items-start">
      <div>
        <h4 className="font-medium">{task.title}</h4>
        {task.description && (
          <p className="text-sm text-gray-600 mt-1">
            {task.description}
          </p>
        )}

        <div className="flex gap-3 mt-2 text-xs text-gray-500">
          <span>Status: {task.status}</span>
          <span>Priority: {task.priority}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <select
          value={task.status}
          onChange={(e) =>
            onStatusChange(task._id, e.target.value)
          }
          className="border rounded px-2 py-1 text-xs"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>

        <button
          onClick={() => onDelete(task._id)}
          className="text-xs text-red-600 hover:underline"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
