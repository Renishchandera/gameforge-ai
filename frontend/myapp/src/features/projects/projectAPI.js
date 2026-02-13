import api from "../../services/axiosInstance";

/**
 * Create project manually
 */
export const createProjectAPI = async (projectData) => {
  // Ensure arrays are properly formatted
  const data = {
    ...projectData,
    genres: Array.isArray(projectData.genres) ? projectData.genres : 
           projectData.genre ? [projectData.genre] : [],
    platforms: Array.isArray(projectData.platforms) ? projectData.platforms : 
              projectData.platform ? [projectData.platform] : []
  };
  
  // Remove old single-value fields if they exist
  delete data.genre;
  delete data.platform;
  
  const res = await api.post("/projects", data);
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
 * Update project status
 */
export const updateProjectStatusAPI = async (projectId, status) => {
  const res = await api.patch(`/projects/${projectId}/status`, { status });
  return res.data;
};

/**
 * Get project statistics
 */
export const getProjectStatsAPI = async (projectId) => {
  const res = await api.get(`/projects/${projectId}/stats`);
  return res.data;
};

/**
 * Delete project
 */
export const deleteProjectAPI = async (projectId) => {
  const res = await api.delete(`/projects/${projectId}`);
  return res.data;
};