import api from "./api";

export const authService = {
  // Register new user
  async register(userData) {
    const response = await api.post("/auth/register", userData);
    if (response.data.token) {
      localStorage.setItem("pharmachain_token", response.data.token);
      localStorage.setItem("pharmachain_user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Login existing user
  async login(credentials) {
    const response = await api.post("/auth/login", credentials);
    if (response.data.token) {
      localStorage.setItem("pharmachain_token", response.data.token);
      localStorage.setItem("pharmachain_user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Google Login
  async googleLogin(credential) {
    const response = await api.post("/auth/google", { credential });
    if (response.data.token) {
      localStorage.setItem("pharmachain_token", response.data.token);
      localStorage.setItem("pharmachain_user", JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // Get current user profile
  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // Logout
  logout() {
    localStorage.removeItem("pharmachain_token");
    localStorage.removeItem("pharmachain_user");
  },

  // Get saved user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem("pharmachain_user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  // Check if token exists
  isAuthenticated() {
    return !!localStorage.getItem("pharmachain_token");
  }
};

export default authService;
