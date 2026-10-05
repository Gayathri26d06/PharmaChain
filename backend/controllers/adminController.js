const User = require("../models/User");
const Medicine = require("../models/Medicine");
const VerificationLog = require("../models/VerificationLog");
const AuditLog = require("../models/AuditLog");

/**
 * @desc    Get all manufacturers
 * @route   GET /api/admin/manufacturers
 * @access  Private/Admin
 */
const getManufacturers = async (req, res, next) => {
  try {
    const manufacturers = await User.find({ role: "manufacturer" }).select("-password");
    return res.status(200).json({ success: true, manufacturers });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new manufacturer
 * @route   POST /api/admin/manufacturers
 * @access  Private/Admin
 */
const createManufacturer = async (req, res, next) => {
  try {
    const { name, email, password, companyName, registrationNumber, address } = req.body;

    if (!name || !email || !password || !companyName || !registrationNumber) {
      return res.status(400).json({ success: false, message: "Please provide name, email, password, company name, and registration number" });
    }

    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      role: "manufacturer",
      companyDetails: { companyName, registrationNumber, address }
    });

    await AuditLog.create({
      action: "MANUFACTURER_CREATED",
      details: `Admin created manufacturer account for ${companyName} (${email})`,
      performedBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Manufacturer created successfully",
      manufacturer: {
        id: user._id,
        name: user.name,
        email: user.email,
        companyDetails: user.companyDetails
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a manufacturer
 * @route   DELETE /api/admin/manufacturers/:id
 * @access  Private/Admin
 */
const deleteManufacturer = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "Manufacturer not found" });
    }
    
    if (user.role !== "manufacturer") {
      return res.status(400).json({ success: false, message: "User is not a manufacturer" });
    }

    const email = user.email;
    await User.findByIdAndDelete(req.params.id);

    await AuditLog.create({
      action: "MANUFACTURER_DELETED",
      details: `Admin deleted manufacturer account (${email})`,
      performedBy: req.user._id
    });

    return res.status(200).json({ success: true, message: "Manufacturer deleted successfully" });
  } catch (error) {
    next(error);
  }
};
/**
 * @desc    Get Admin System Stats
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getAdminStats = async (req, res, next) => {
  try {
    const totalManufacturers = await User.countDocuments({ role: "manufacturer" });
    const totalMedicines = await Medicine.countDocuments();
    const onChainTx = await Medicine.countDocuments({ blockchainTransactionHash: { $ne: "" } });
    
    return res.status(200).json({
      success: true,
      stats: {
        totalManufacturers,
        totalMedicines,
        onChainTransactions: onChainTx
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get All Medicine Records (Admin View)
 * @route   GET /api/admin/medicines
 * @access  Private/Admin
 */
const getAllMedicines = async (req, res, next) => {
  try {
    const medicines = await Medicine.find().populate("createdBy", "name email").sort({ createdAt: -1 });
    return res.status(200).json({ success: true, medicines });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Audit Logs
 * @route   GET /api/admin/logs
 * @access  Private/Admin
 */
const getAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().populate("performedBy", "name email role").sort({ createdAt: -1 }).limit(50);
    return res.status(200).json({ success: true, logs });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getManufacturers,
  createManufacturer,
  deleteManufacturer,
  getAdminStats,
  getAllMedicines,
  getAuditLogs
};
