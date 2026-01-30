import api from "../../services/axiosInstance";

/**
 * Get all tasks for a project
 */
export const getProjectTasksAPI = async (projectId) => {
  const res = await api.get(`/projects/${projectId}/tasks`);
  return res.data;
};

/**
 * Create a new task
 */
export const createTaskAPI = async (projectId, data) => {
  const res = await api.post(`/projects/${projectId}/tasks`, data);
  return res.data;
};

/**
 * Update a task
 */
export const updateTaskAPI = async (taskId, data) => {
  const res = await api.put(`/tasks/${taskId}`, data);
  return res.data;
};

/**
 * Delete a task
 */
export const deleteTaskAPI = async (taskId) => {
  const res = await api.delete(`/tasks/${taskId}`);
  return res.data;
};
