const Medicine = require("../models/Medicine");
const VerificationLog = require("../models/VerificationLog");
const blockchainService = require("../services/blockchainService");
const crypto = require("crypto");

/**
 * Helper to generate unique Medicine ID: MED-<YEAR>-<6_CHAR_HEX>
 * e.g., MED-2026-A8F92K
 */
const generateMedicineId = () => {
  const year = new Date().getFullYear();
  const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `MED-${year}-${randomHex}`;
};

/**
 * @desc    Register / Add a new medicine
 * @route   POST /api/medicines
 * @access  Private (Manufacturer only)
 */
const addMedicine = async (req, res, next) => {
  try {
    const {
      name,
      batchNumber,
      manufacturer,
      manufacturingDate,
      expiryDate,
      quantity,
      description
    } = req.body;

    // Validation
    if (!name || !batchNumber || !manufacturer || !manufacturingDate || !expiryDate || !quantity) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required medicine registration fields"
      });
    }

    const mfgDate = new Date(manufacturingDate);
    const expDate = new Date(expiryDate);

    if (isNaN(mfgDate.getTime()) || isNaN(expDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid manufacturing or expiry date format"
      });
    }

    if (expDate <= mfgDate) {
      return res.status(400).json({
        success: false,
        message: "Expiry date must be after manufacturing date"
      });
    }

    // Generate unique ID
    let medicineId = generateMedicineId();
    let exists = await Medicine.findOne({ medicineId });
    while (exists) {
      medicineId = generateMedicineId();
      exists = await Medicine.findOne({ medicineId });
    }

    // Record on Blockchain Smart Contract
    const chainResult = await blockchainService.registerMedicineOnChain({
      medicineId,
      name: name.trim(),
      batchNumber: batchNumber.trim().toUpperCase(),
      manufacturer: manufacturer.trim(),
      manufacturingDate: mfgDate.toISOString(),
      expiryDate: expDate.toISOString()
    });

    const isExpired = new Date() > expDate;
    const initialStatus = isExpired ? "EXPIRED" : "GENUINE";

    // Save to MongoDB
    const medicine = await Medicine.create({
      medicineId,
      name: name.trim(),
      batchNumber: batchNumber.trim().toUpperCase(),
      manufacturer: manufacturer.trim(),
      manufacturingDate: mfgDate,
      expiryDate: expDate,
      quantity: Number(quantity),
      description: (description || "").trim(),
      blockchainTransactionHash: chainResult.transactionHash || "",
      blockchainStatus: chainResult.status || "COMMITTED",
      blockchainBlockNumber: chainResult.blockNumber || null,
      status: initialStatus,
      createdBy: req.user._id
    });

    const frontendBaseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verificationUrl = `${frontendBaseUrl}/verify/${medicineId}`;

    return res.status(201).json({
      success: true,
      message: "Medicine successfully registered and recorded on blockchain",
      medicine,
      verificationUrl,
      blockchain: {
        transactionHash: chainResult.transactionHash,
        blockNumber: chainResult.blockNumber,
        status: chainResult.status
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get list of medicines with search & filter
 * @route   GET /api/medicines
 * @access  Private / Authenticated
 */
const getMedicines = async (req, res, next) => {
  try {
    const { search, status, manufacturerOnly } = req.query;
    let query = {};

    // If manufacturer requests only their medicines
    if (manufacturerOnly === "true" || req.user.role === "manufacturer") {
      query.createdBy = req.user._id;
    }

    // Text search on name, batch, or medicineId
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { batchNumber: { $regex: search, $options: "i" } },
        { medicineId: { $regex: search, $options: "i" } },
        { manufacturer: { $regex: search, $options: "i" } }
      ];
    }

    // Filter by status
    if (status && ["GENUINE", "EXPIRED", "SUSPICIOUS", "RECALLED"].includes(status.toUpperCase())) {
      query.status = status.toUpperCase();
    }

    const medicines = await Medicine.find(query)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: medicines.length,
      medicines
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single medicine details by ID or medicineId
 * @route   GET /api/medicines/:id
 * @access  Private / Authenticated
 */
const getMedicineById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let medicine = null;
    if (id.startsWith("MED-")) {
      medicine = await Medicine.findOne({ medicineId: id.toUpperCase() }).populate("createdBy", "name email");
    } else {
      medicine = await Medicine.findById(id).populate("createdBy", "name email");
    }

    if (!medicine) {
      return res.status(404).json({
        success: false,
        message: "Medicine not found"
      });
    }

    return res.status(200).json({
      success: true,
      medicine
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Public verification endpoint (QR code scan or manual input)
 * @route   GET /api/medicines/verify/:medicineId
 * @access  Public
 */
const verifyMedicine = async (req, res, next) => {
  try {
    const rawId = req.params.medicineId || "";
    const medicineId = rawId.trim().toUpperCase();
    const source = req.query.source || "MANUAL_INPUT";
    const ip = req.ip || req.connection.remoteAddress || "127.0.0.1";
    const userAgent = req.headers["user-agent"] || "Unknown";

    if (!medicineId) {
      return res.status(400).json({
        success: false,
        verificationResult: "INVALID",
        message: "Medicine ID is required for verification"
      });
    }

    // Step 1: Query MongoDB record
    const dbMedicine = await Medicine.findOne({ medicineId });

    // Step 2: Query Blockchain Smart Contract record
    const chainRecord = await blockchainService.getMedicineFromChain(medicineId);

    // Scenario 1: Medicine ID does not exist in database and not in blockchain
    if (!dbMedicine && (!chainRecord.success || !chainRecord.data || !chainRecord.data.exists)) {
      await VerificationLog.create({
        medicineId,
        result: "INVALID",
        verificationSource: source,
        ipAddress: ip,
        userAgent,
        notes: "Attempted verification of non-existent medicine ID"
      });

      return res.status(404).json({
        success: false,
        verificationResult: "INVALID",
        message: "Invalid or counterfeit medicine.",
        details: {
          medicineId,
          explanation: "This Medicine ID was never registered by an authorized manufacturer on the blockchain ledger."
        }
      });
    }

    // Determine baseline medicine data
    const medData = dbMedicine || chainRecord.data;

    // Step 3: Check Expiration
    const now = new Date();
    const expiryDate = new Date(medData.expiryDate);
    const isExpired = now > expiryDate;

    // Step 4: Check Suspicious Conditions
    // Condition A: High velocity scans (e.g. > 10 scans in last 1 hour) - sign of barcode cloning
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentScanCount = await VerificationLog.countDocuments({
      medicineId,
      createdAt: { $gte: oneHourAgo }
    });

    // Condition B: Data mismatch between MongoDB and Blockchain (Tampering detection!)
    let dataMismatch = false;
    if (dbMedicine && chainRecord.success && chainRecord.data) {
      const chainData = chainRecord.data;
      if (
        dbMedicine.batchNumber !== chainData.batchNumber ||
        dbMedicine.name.toLowerCase() !== chainData.name.toLowerCase()
      ) {
        dataMismatch = true;
      }
    }

    // Condition C: Explicitly flagged as SUSPICIOUS or RECALLED
    const isMarkedSuspicious =
      (dbMedicine && dbMedicine.status === "SUSPICIOUS") ||
      (chainRecord.data && chainRecord.data.status === "SUSPICIOUS");

    const isRecalled =
      (dbMedicine && dbMedicine.status === "RECALLED") ||
      (chainRecord.data && chainRecord.data.status === "RECALLED");

    let verificationResult = "GENUINE";
    let message = "Medicine is genuine and authenticated by blockchain.";

    if (isRecalled) {
      verificationResult = "SUSPICIOUS";
      message = "Suspicious medicine: This batch has been officially recalled by the manufacturer.";
    } else if (dataMismatch) {
      verificationResult = "SUSPICIOUS";
      message = "Suspicious medicine: Integrity mismatch detected between local database and immutable blockchain ledger.";
    } else if (recentScanCount >= 10) {
      verificationResult = "SUSPICIOUS";
      message = "Suspicious medicine: Unusually high scan frequency detected across multiple locations. Possible counterfeit duplicate packaging.";
    } else if (isMarkedSuspicious) {
      verificationResult = "SUSPICIOUS";
      message = "Suspicious medicine: Marked as flagged under manufacturer review.";
    } else if (isExpired) {
      verificationResult = "EXPIRED";
      message = "Medicine expired.";
    }

    // Step 5: Log Verification Attempt
    const log = await VerificationLog.create({
      medicineId,
      result: verificationResult,
      verificationSource: source,
      scannedBy: req.user ? req.user._id : null,
      ipAddress: ip,
      userAgent,
      notes: message
    });

    const totalScans = await VerificationLog.countDocuments({ medicineId });

    return res.status(200).json({
      success: true,
      verificationResult,
      message,
      medicine: {
        medicineId: medData.medicineId,
        name: medData.name,
        batchNumber: medData.batchNumber,
        manufacturer: medData.manufacturer,
        manufacturingDate: medData.manufacturingDate,
        expiryDate: medData.expiryDate,
        quantity: medData.quantity,
        description: medData.description,
        status: verificationResult,
        blockchainTransactionHash: dbMedicine ? dbMedicine.blockchainTransactionHash : (chainRecord.data ? chainRecord.data.transactionHash : ""),
        blockchainStatus: dbMedicine ? dbMedicine.blockchainStatus : "COMMITTED"
      },
      blockchainProof: {
        verifiedOnChain: chainRecord.success && chainRecord.data ? true : false,
        registeredBy: chainRecord.data ? chainRecord.data.registeredBy : null,
        registeredBlock: chainRecord.data ? chainRecord.data.registeredAtBlock : (dbMedicine ? dbMedicine.blockchainBlockNumber : null),
        onChainStatus: chainRecord.data ? chainRecord.data.status : verificationResult
      },
      telemetry: {
        totalScans,
        recentScansPastHour: recentScanCount + 1,
        verifiedAt: log.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get dashboard metrics and analytics
 * @route   GET /api/medicines/stats/dashboard
 * @access  Private / Authenticated
 */
const getDashboardStats = async (req, res, next) => {
  try {
    let filter = {};
    if (req.user && req.user.role === "manufacturer") {
      filter.createdBy = req.user._id;
    }

    const totalMedicines = await Medicine.countDocuments(filter);
    const genuineMedicines = await Medicine.countDocuments({ ...filter, status: "GENUINE" });
    const expiredMedicines = await Medicine.countDocuments({ ...filter, status: "EXPIRED" });
    const suspiciousMedicines = await Medicine.countDocuments({ ...filter, status: { $in: ["SUSPICIOUS", "RECALLED"] } });

    // Transactions count
    const blockchainTransactions = await Medicine.countDocuments({
      ...filter,
      blockchainTransactionHash: { $ne: "" }
    });

    // Recent registered medicines
    const recentMedicines = await Medicine.find(filter)
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent verifications
    const recentVerifications = await VerificationLog.find()
      .sort({ createdAt: -1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      stats: {
        totalMedicines,
        genuineMedicines,
        expiredMedicines,
        suspiciousMedicines,
        blockchainTransactions
      },
      recentMedicines,
      recentVerifications
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addMedicine,
  getMedicines,
  getMedicineById,
  verifyMedicine,
  getDashboardStats
};
