import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("taskflow_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  signup: (userData) => api.post("/auth/signup", userData),
  login: (userData) => api.post("/auth/login", userData),
};

// Tasks API
export const tasksAPI = {
  getTasks: () => api.get("/tasks"),
  createTask: (taskData) => api.post("/tasks", taskData),
  updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

// Community Tasks API
export const communityAPI = {
  getTasks: () => api.get("/community/tasks"),
  createTask: (taskData) => api.post("/community/tasks", taskData),
  updateTask: (id, taskData) => api.put(`/community/tasks/${id}`, taskData),
  deleteTask: (id) => api.delete(`/community/tasks/${id}`),
};

export default api;
