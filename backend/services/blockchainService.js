const { getContract, getProvider } = require("../config/blockchain");

/**
 * Service encapsulating all interactions with the PharmaChain Ethereum Smart Contract
 */
class BlockchainService {
  /**
   * Register a new medicine on the blockchain
   */
  async registerMedicineOnChain({
    medicineId,
    name,
    batchNumber,
    manufacturer,
    manufacturingDate,
    expiryDate
  }) {
    try {
      const contract = getContract(true);

      const mfgEpoch = Math.floor(new Date(manufacturingDate).getTime() / 1000);
      const expEpoch = Math.floor(new Date(expiryDate).getTime() / 1000);

      console.log(`[Blockchain Relayer] Dispatching registerMedicine for ID: ${medicineId}...`);
      const tx = await contract.registerMedicine(
        medicineId,
        name,
        batchNumber,
        manufacturer,
        mfgEpoch,
        expEpoch
      );

      console.log(`[Blockchain Relayer] Transaction broadcasted. TxHash: ${tx.hash}. Waiting for block confirmation...`);
      const receipt = await tx.wait(1);
      console.log(`[Blockchain Relayer] Mined in block: ${receipt.blockNumber}, gas used: ${receipt.gasUsed.toString()}`);

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: Number(receipt.blockNumber),
        gasUsed: receipt.gasUsed.toString(),
        status: "COMMITTED"
      };
    } catch (error) {
      console.error("[Blockchain Relayer Error]", error.message);

      // Distinguish between contract revert reason and network connection error
      const isOffline = error.code === "ECONNREFUSED" || error.message.includes("could not detect network");
      return {
        success: false,
        error: error.reason || error.message,
        isOffline,
        status: isOffline ? "OFFLINE" : "FAILED",
        // Fallback simulation hash for dev demonstration if blockchain node is not yet started
        transactionHash: "0x" + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")
      };
    }
  }

  /**
   * Retrieve medicine details from the smart contract
   */
  async getMedicineFromChain(medicineId) {
    try {
      const contract = getContract(false);
      const med = await contract.getMedicine(medicineId);

      const statusMap = {
        0: "GENUINE",
        1: "EXPIRED",
        2: "SUSPICIOUS",
        3: "RECALLED"
      };

      return {
        success: true,
        data: {
          medicineId: med[0],
          name: med[1],
          batchNumber: med[2],
          manufacturer: med[3],
          manufacturingDate: new Date(Number(med[4]) * 1000).toISOString(),
          expiryDate: new Date(Number(med[5]) * 1000).toISOString(),
          statusNumber: Number(med[6]),
          status: statusMap[Number(med[6])] || "GENUINE",
          exists: med[7],
          registeredBy: med[8],
          registeredAtBlock: Number(med[9]),
          registeredTimestamp: new Date(Number(med[10]) * 1000).toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.reason || error.message
      };
    }
  }

  /**
   * Check if medicine exists on the smart contract
   */
  async medicineExistsOnChain(medicineId) {
    try {
      const contract = getContract(false);
      const exists = await contract.medicineExists(medicineId);
      return { success: true, exists };
    } catch (error) {
      return { success: false, exists: false, error: error.message };
    }
  }

  /**
   * Update status of medicine on the smart contract
   */
  async updateMedicineStatusOnChain(medicineId, newStatusCode) {
    try {
      const contract = getContract(true);
      const tx = await contract.updateMedicineStatus(medicineId, newStatusCode);
      const receipt = await tx.wait(1);
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: Number(receipt.blockNumber)
      };
    } catch (error) {
      return {
        success: false,
        error: error.reason || error.message
      };
    }
  }

  /**
   * Retrieve total count and all registered medicine IDs on chain
   */
  async getAllMedicineIdsFromChain() {
    try {
      const contract = getContract(false);
      const ids = await contract.getAllMedicineIds();
      return { success: true, ids: [...ids] };
    } catch (error) {
      return { success: false, ids: [], error: error.message };
    }
  }

  /**
   * Check network status and health
   */
  async getBlockchainHealth() {
    try {
      const provider = getProvider();
      const network = await provider.getNetwork();
      const blockNumber = await provider.getBlockNumber();
      return {
        online: true,
        chainId: network.chainId.toString(),
        name: network.name,
        latestBlock: blockNumber
      };
    } catch (error) {
      return {
        online: false,
        error: error.message,
        latestBlock: 0
      };
    }
  }
}

module.exports = new BlockchainService();
