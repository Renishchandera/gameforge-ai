import api from "../../services/axiosInstance";

export const loginAPI = async (credentials) => {
    const response = await api.post(
        "/auth/login",
        credentials
    );
    return response.data;
};

export const registerAPI = async (data) => {
    const response = await api.post(
        "/auth/register",
        data
        );
        return response.data;
};
