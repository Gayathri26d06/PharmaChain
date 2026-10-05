const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please provide a valid email address"
      ]
    },
    password: {
      type: String,
      required: [
        function () {
          return !this.googleId;
        },
        "Password is required"
      ],
      minlength: [6, "Password must be at least 6 characters long"]
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },
    role: {
      type: String,
      enum: {
        values: ["admin", "manufacturer", "customer"],
        message: "Role must be either 'admin', 'manufacturer' or 'customer'"
      },
      default: "customer"
    },
    manufacturerStatus: {
      type: String,
      enum: ["not_applicable", "pending", "approved", "rejected"],
      default: "not_applicable"
    },
    companyDetails: {
      companyName: String,
      registrationNumber: String,
      address: String
    },
    walletAddress: {
      type: String,
      default: "",
      trim: true
    }
  },
  {
    timestamps: true
  }
);

// Pre-save password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password helper
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
