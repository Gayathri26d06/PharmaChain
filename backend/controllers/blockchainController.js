const blockchainService = require("../services/blockchainService");
const { CONTRACT_ADDRESS, RPC_URL } = require("../config/blockchain");
const Medicine = require("../models/Medicine");

/**
 * @desc    Get live blockchain health & smart contract metadata
 * @route   GET /api/blockchain/info
 * @access  Public / Authenticated
 */
const getBlockchainInfo = async (req, res, next) => {
  try {
    const health = await blockchainService.getBlockchainHealth();
    const countResult = await blockchainService.getAllMedicineIdsFromChain();

    return res.status(200).json({
      success: true,
      network: {
        rpcUrl: RPC_URL,
        contractAddress: CONTRACT_ADDRESS,
        isOnline: health.online,
        chainId: health.chainId || "31337",
        networkName: health.name || "Hardhat Localhost",
        latestBlock: health.latestBlock || 0,
        totalMedsOnChain: countResult.ids.length
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all blockchain records directly from smart contract and database
 * @route   GET /api/blockchain/records
 * @access  Public / Authenticated
 */
const getBlockchainRecords = async (req, res, next) => {
  try {
    // 1. Fetch DB records with transaction hashes
    const dbRecords = await Medicine.find({
      blockchainTransactionHash: { $exists: true, $ne: "" }
    }).sort({ createdAt: -1 });

    // 2. Fetch on-chain IDs
    const chainIdsResult = await blockchainService.getAllMedicineIdsFromChain();

    return res.status(200).json({
      success: true,
      contractAddress: CONTRACT_ADDRESS,
      totalOnChainCount: chainIdsResult.ids.length,
      onChainIds: chainIdsResult.ids,
      records: dbRecords.map((m) => ({
        medicineId: m.medicineId,
        name: m.name,
        batchNumber: m.batchNumber,
        manufacturer: m.manufacturer,
        manufacturingDate: m.manufacturingDate,
        expiryDate: m.expiryDate,
        transactionHash: m.blockchainTransactionHash,
        blockNumber: m.blockchainBlockNumber,
        status: m.status,
        blockchainStatus: m.blockchainStatus,
        createdAt: m.createdAt
      }))
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single on-chain raw record by Medicine ID
 * @route   GET /api/blockchain/records/:medicineId
 * @access  Public
 */
const getSingleChainRecord = async (req, res, next) => {
  try {
    const { medicineId } = req.params;
    const result = await blockchainService.getMedicineFromChain(medicineId.toUpperCase());

    if (!result.success) {
      return res.status(404).json({
        success: false,
        message: result.error || "On-chain record not found"
      });
    }

    return res.status(200).json({
      success: true,
      contractAddress: CONTRACT_ADDRESS,
      data: result.data
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlockchainInfo,
  getBlockchainRecords,
  getSingleChainRecord
};
