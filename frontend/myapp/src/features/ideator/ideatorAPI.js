import api from "../../services/axiosInstance";

export const generateIdeaAPI = async (data) =>
{
    try{
        const res = await  api.post("/idea/generate", data);
        return res.data;
    }catch(e)
    {
        console.log(e);
    }
}

export const feasibilityAPI = async (idea) => {
    const res = await api.post("/idea/feasibility", { idea });
    return res.data;
}



export const saveIdeaAPI = async (ideaData) => {
  const res = await api.post("/idea/save", ideaData);
  return res.data;
};

export const getSavedIdeasAPI = async () => {
  const res = await api.get("/idea/saved");
  return res.data;
};