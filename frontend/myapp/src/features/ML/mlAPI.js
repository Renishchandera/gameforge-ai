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