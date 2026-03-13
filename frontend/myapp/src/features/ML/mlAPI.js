import api from "../../services/axiosInstance";


export const predictSuccessAPI = async (projectId) => {

    try{
        const res = await api.post(`ml/predict-success/${projectId}`);
        return res.data;  
    }catch(e)
    {
        console.log(e);
    }
}


//ACtually the AI LLM Service API
export const projectFeasibilityAPI = async (projectId) => {
  const res = await api.post(`/projects/${projectId}/feasibility`);
  return res.data;
};