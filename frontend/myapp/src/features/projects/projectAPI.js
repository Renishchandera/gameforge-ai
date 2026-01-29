import api from "../../services/axiosInstance";

/**
 * Create project manually
 */
export const createProjectAPI = async (projectData) => {
  const res = await api.post("/projects", projectData);
  return res.data;
};

/**
 * Create project from idea
 */
export const createProjectFromIdeaAPI = async (ideaId) => {
  const res = await api.post(`/projects/from-idea/${ideaId}`);
  return res.data;
};

/**
 * Get all projects
 */
export const getProjectsAPI = async () => {
  const res = await api.get("/projects");
  return res.data;
};

/**
 * Get single project
 */
export const getProjectByIdAPI = async (projectId) => {
  const res = await api.get(`/projects/${projectId}`);
  return res.data;
};

/**
 * Update project
 */
export const updateProjectAPI = async (projectId, data) => {
  const res = await api.put(`/projects/${projectId}`, data);
  return res.data;
};

/**
 * Delete project
 */
export const deleteProjectAPI = async (projectId) => {
  const res = await api.delete(`/projects/${projectId}`);
  return res.data;
};
