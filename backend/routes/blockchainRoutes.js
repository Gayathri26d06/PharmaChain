const express = require("express");
const router = express.Router();
const {
  getBlockchainInfo,
  getBlockchainRecords,
  getSingleChainRecord
} = require("../controllers/blockchainController");
const { protect } = require("../middleware/authMiddleware");

// Public endpoints
router.get("/info", getBlockchainInfo);
router.get("/records/:medicineId", getSingleChainRecord);

// Protected endpoints
router.get("/records", protect, getBlockchainRecords);

module.exports = router;
