const mongoose = require("mongoose");

const verificationLogSchema = new mongoose.Schema(
  {
    medicineId: {
      type: String,
      required: true,
      uppercase: true,
      index: true
    },
    result: {
      type: String,
      enum: ["GENUINE", "EXPIRED", "SUSPICIOUS", "INVALID"],
      required: true
    },
    verificationSource: {
      type: String,
      enum: ["MANUAL_INPUT", "QR_CAMERA", "DIRECT_LINK"],
      default: "MANUAL_INPUT"
    },
    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null
    },
    ipAddress: {
      type: String,
      default: "127.0.0.1"
    },
    userAgent: {
      type: String,
      default: "Unknown"
    },
    notes: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("VerificationLog", verificationLogSchema);
