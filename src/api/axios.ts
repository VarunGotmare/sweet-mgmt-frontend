import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
    headers: {
        "Content-Type": "application/json",
    },
    });

    //add jwt token to every request if exists
    api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
    );

    //err handler
    api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        //logout if unauthorized
        if (status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        }

        return Promise.reject(error);
    }
    );

export default api;
