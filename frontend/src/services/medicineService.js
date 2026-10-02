import api from "./api";

export const medicineService = {
  // Register / Add a new medicine (Manufacturer only)
  async addMedicine(medicineData) {
    const response = await api.post("/medicines", medicineData);
    return response.data;
  },

  // Get medicines list with optional search and filters
  async getMedicines(params = {}) {
    const response = await api.get("/medicines", { params });
    return response.data;
  },

  // Get medicine by ID
  async getMedicineById(id) {
    const response = await api.get(`/medicines/${id}`);
    return response.data;
  },

  // Verify medicine (Public - by ID or scanned QR)
  async verifyMedicine(medicineId, source = "MANUAL_INPUT") {
    const response = await api.get(`/medicines/verify/${encodeURIComponent(medicineId)}`, {
      params: { source }
    });
    return response.data;
  },

  // Get dashboard metrics and statistics
  async getDashboardStats() {
    const response = await api.get("/medicines/stats/dashboard");
    return response.data;
  }
};

export default medicineService;
