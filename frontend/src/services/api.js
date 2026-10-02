import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Attach JWT token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("pharmachain_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If token is invalid or expired, clear local storage
    if (error.response && error.response.status === 401) {
      const isAuthRoute = error.config.url.includes("/auth/login") || error.config.url.includes("/auth/register");
      if (!isAuthRoute) {
        localStorage.removeItem("pharmachain_token");
        localStorage.removeItem("pharmachain_user");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
