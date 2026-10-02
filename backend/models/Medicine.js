const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    medicineId: {
      type: String,
      required: [true, "Medicine ID is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    name: {
      type: String,
      required: [true, "Medicine name is required"],
      trim: true
    },
    batchNumber: {
      type: String,
      required: [true, "Batch number is required"],
      uppercase: true,
      trim: true,
      index: true
    },
    manufacturer: {
      type: String,
      required: [true, "Manufacturer name is required"],
      trim: true
    },
    manufacturingDate: {
      type: Date,
      required: [true, "Manufacturing date is required"]
    },
    expiryDate: {
      type: Date,
      required: [true, "Expiry date is required"]
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"]
    },
    description: {
      type: String,
      default: "",
      trim: true
    },
    blockchainTransactionHash: {
      type: String,
      default: ""
    },
    blockchainStatus: {
      type: String,
      enum: ["COMMITTED", "PENDING", "FAILED", "OFFLINE"],
      default: "COMMITTED"
    },
    blockchainBlockNumber: {
      type: Number,
      default: null
    },
    status: {
      type: String,
      enum: ["GENUINE", "EXPIRED", "SUSPICIOUS", "RECALLED"],
      default: "GENUINE"
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Virtual to auto-determine if expired on query
medicineSchema.virtual("isExpired").get(function () {
  return new Date() > this.expiryDate;
});

module.exports = mongoose.model("Medicine", medicineSchema);
