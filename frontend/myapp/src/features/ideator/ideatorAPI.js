import api from "../../services/axiosInstance";

export const generateIdeaAPI = async (formData) => {
  // Send arrays directly - no conversion needed
  const res = await api.post("/idea/generate", formData);
  return res.data;
};

export const feasibilityAPI = async (ideaText) => {
  const res = await api.post("/idea/feasibility", { idea: ideaText });
  return res.data;
};

export const saveIdeaAPI = async (ideaData) => {
  // Ensure we're sending arrays
  const dataToSend = {
    ...ideaData,
    genres: Array.isArray(ideaData.genres) ? ideaData.genres : 
           ideaData.genre ? [ideaData.genre] : [],
    platforms: Array.isArray(ideaData.platforms) ? ideaData.platforms : 
              ideaData.platform ? [ideaData.platform] : []
  };
  
  // Remove old single-value fields if they exist
  delete dataToSend.genre;
  delete dataToSend.platform;
  
  const res = await api.post("/idea/save", dataToSend);
  return res.data;
};

export const getSavedIdeasAPI = async () => {
  const res = await api.get("/idea/saved");
  return res.data;
};

export const getIdeaByIdAPI = async (ideaId) => {
  const res = await api.get(`/idea/${ideaId}`);
  return res.data;
};