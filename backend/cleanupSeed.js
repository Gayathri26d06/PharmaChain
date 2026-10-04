const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const User = require("./models/User");
const Medicine = require("./models/Medicine");
const VerificationLog = require("./models/VerificationLog");

const cleanupDatabase = async () => {
  const env = process.env.NODE_ENV || "development";
  if (env !== "development" && env !== "test") {
    console.error("[Cleanup Error] Cleanup is only permitted in development or test environments.");
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pharmachain";

  try {
    console.log(`[Cleanup] Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log("[Cleanup] Connected successfully.");

    const demoUsers = ["manufacturer@pharmachain.com", "customer@pharmachain.com"];
    const demoMedicineIds = ["MED-2026-A8F92K", "MED-2024-EXP01X", "MED-2026-SUSP99"];

    const usersToDelete = await User.find({ email: { $in: demoUsers } });
    const medicinesToDelete = await Medicine.find({ medicineId: { $in: demoMedicineIds } });
    const logsToDelete = await VerificationLog.find({ medicineId: { $in: demoMedicineIds } });

    console.log("\n=======================================================");
    console.log("   Cleanup Dry Run Report");
    console.log("=======================================================");
    
    if (usersToDelete.length > 0) {
      console.log(`Users to delete (${usersToDelete.length}):\n  - ${usersToDelete.map(u => u.email).join('\n  - ')}`);
    } else {
      console.log("Users to delete: None found.");
    }

    if (medicinesToDelete.length > 0) {
      console.log(`\nMedicines to delete (${medicinesToDelete.length}):\n  - ${medicinesToDelete.map(m => m.medicineId).join('\n  - ')}`);
    } else {
      console.log("\nMedicines to delete: None found.");
    }

    if (logsToDelete.length > 0) {
      console.log(`\nVerification Logs to delete (${logsToDelete.length}) for medicine IDs: ${demoMedicineIds.join(', ')}`);
    } else {
      console.log("\nVerification Logs to delete: None found.");
    }
    
    if (!process.argv.includes('--execute')) {
      console.log("\n[INFO] This was a dry run. To actually execute the deletion, run:");
      console.log("       node cleanupSeed.js --execute");
      console.log("=======================================================\n");
      await mongoose.disconnect();
      process.exit(0);
    }

    console.log("\nExecuting cleanup...");
    
    if (usersToDelete.length > 0) {
      const result = await User.deleteMany({ email: { $in: demoUsers } });
      console.log(`[Deleted] ${result.deletedCount} demo users.`);
    }

    if (medicinesToDelete.length > 0) {
      const result = await Medicine.deleteMany({ medicineId: { $in: demoMedicineIds } });
      console.log(`[Deleted] ${result.deletedCount} demo medicines.`);
    }

    if (logsToDelete.length > 0) {
      const result = await VerificationLog.deleteMany({ medicineId: { $in: demoMedicineIds } });
      console.log(`[Deleted] ${result.deletedCount} demo verification logs.`);
    }

    console.log("\n[Success] Cleanup complete! Real users and genuine records remain unaffected.");
    console.log("=======================================================\n");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("[Cleanup Error]", err);
    process.exit(1);
  }
};

cleanupDatabase();
