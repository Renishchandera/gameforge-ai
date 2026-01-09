import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    timeout: 30000,
    headers: {
        "Content-Type":  "application/json",
    },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      const res = await api.post("/auth/refresh");
      const newToken = res.data.accessToken;

      localStorage.setItem("token", newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return api(originalRequest);
    }

    return Promise.reject(error);
  }
);


export default axiosInstance;