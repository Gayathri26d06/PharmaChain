import api from "./api";

export const blockchainService = {
  // Get network health, RPC status, contract address
  async getBlockchainInfo() {
    const response = await api.get("/blockchain/info");
    return response.data;
  },

  // Get all blockchain ledger records
  async getBlockchainRecords() {
    const response = await api.get("/blockchain/records");
    return response.data;
  },

  // Get raw on-chain tuple for a medicine
  async getSingleChainRecord(medicineId) {
    const response = await api.get(`/blockchain/records/${encodeURIComponent(medicineId)}`);
    return response.data;
  }
};

export default blockchainService;
