import axios from "axios";

const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const api = axios.create({ baseURL: BASE, withCredentials: true });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.clear();
      window.location.href = "/LoginPage";
    }
    return Promise.reject(err);
  }
);

export const publicApi = axios.create({ baseURL: BASE });

export default api;