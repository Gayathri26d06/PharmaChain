const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });

const User = require("./models/User");
const Medicine = require("./models/Medicine");
const VerificationLog = require("./models/VerificationLog");

const seedDatabase = async () => {
  const env = process.env.NODE_ENV || "development";
  if (env !== "development" && env !== "test") {
    console.error("[Seed Error] Seeding is only permitted in development or test environments.");
    process.exit(1);
  }

  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pharmachain";

  try {
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log("[Seed] Connected successfully.");

    // Clean existing seed records
    await User.deleteMany({
      email: { $in: ["manufacturer@pharmachain.com", "customer@pharmachain.com"] }
    });

    console.log("[Seed] Creating default demonstration users...");

    // 1. Create Manufacturer
    const manufacturer = await User.create({
      name: "Pfizer Global Manufacturing",
      email: "manufacturer@pharmachain.com",
      password: "Password123",
      role: "manufacturer",
      walletAddress: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
    });

    // 2. Create Customer
    const customer = await User.create({
      name: "Sarah Connor (Customer)",
      email: "customer@pharmachain.com",
      password: "Password123",
      role: "customer",
      walletAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
    });

    console.log(`[Seed] Manufacturer created: ${manufacturer.email}`);
    console.log(`[Seed] Customer created:     ${customer.email}`);

    // Clean sample medicines
    await Medicine.deleteMany({
      medicineId: { $in: ["MED-2026-A8F92K", "MED-2024-EXP01X", "MED-2026-SUSP99"] }
    });

    console.log("[Seed] Creating baseline pharmaceutical batches...");

    // 3. Sample Genuine Medicine
    const genuineMed = await Medicine.create({
      medicineId: "MED-2026-A8F92K",
      name: "Amoxicillin 500mg",
      batchNumber: "AMX-2026-01",
      manufacturer: "Pfizer Global Manufacturing",
      manufacturingDate: new Date("2026-01-15"),
      expiryDate: new Date("2028-06-30"),
      quantity: 5000,
      description: "Broad-spectrum antibacterial capsules for bacterial respiratory and systemic infections.",
      blockchainStatus: "OFFLINE",
      status: "GENUINE",
      createdBy: manufacturer._id
    });

    // 4. Sample Expired Medicine
    const expiredMed = await Medicine.create({
      medicineId: "MED-2024-EXP01X",
      name: "Paracetamol 650mg Oral Solution",
      batchNumber: "PCM-2023-99",
      manufacturer: "Pfizer Global Manufacturing",
      manufacturingDate: new Date("2023-01-01"),
      expiryDate: new Date("2024-05-01"), // Expired
      quantity: 1200,
      description: "Analgesic and antipyretic syrup formulation.",
      blockchainStatus: "OFFLINE",
      status: "EXPIRED",
      createdBy: manufacturer._id
    });

    // 5. Sample Suspicious Medicine (Flagged batch)
    const suspiciousMed = await Medicine.create({
      medicineId: "MED-2026-SUSP99",
      name: "Azithromycin 250mg",
      batchNumber: "AZI-FLAGGED-03",
      manufacturer: "Pfizer Global Manufacturing",
      manufacturingDate: new Date("2026-02-01"),
      expiryDate: new Date("2027-12-31"),
      quantity: 300,
      description: "Macrolide antibiotic tablets under manufacturer quality audit.",
      blockchainStatus: "OFFLINE",
      status: "SUSPICIOUS",
      createdBy: manufacturer._id
    });

    // 6. Log sample verifications
    await VerificationLog.create([
      {
        medicineId: "MED-2026-A8F92K",
        result: "GENUINE",
        verificationSource: "QR_CAMERA",
        scannedBy: customer._id,
        notes: "Routine retail pharmacy point-of-sale verification"
      },
      {
        medicineId: "MED-2024-EXP01X",
        result: "EXPIRED",
        verificationSource: "MANUAL_INPUT",
        scannedBy: customer._id,
        notes: "Expired medicine detected and blocked"
      },
      {
        medicineId: "MED-2026-SUSP99",
        result: "SUSPICIOUS",
        verificationSource: "DIRECT_LINK",
        scannedBy: null,
        notes: "Anomalous scan velocity warning triggered"
      }
    ]);

    console.log("\n=======================================================");
    console.log("   PharmaChain Database Seeding Completed!            ");
    console.log("=======================================================");
    console.log("Demo Credentials:");
    console.log("1. Manufacturer:");
    console.log("   Email:    manufacturer@pharmachain.com");
    console.log("   Password: Password123");
    console.log("2. Customer:");
    console.log("   Email:    customer@pharmachain.com");
    console.log("   Password: Password123");
    console.log("\nSample Medicine IDs for Testing:");
    console.log("   Genuine:    MED-2026-A8F92K");
    console.log("   Expired:    MED-2024-EXP01X");
    console.log("   Suspicious: MED-2026-SUSP99");
    console.log("   Invalid:    MED-FAKE-999999 (any unlisted ID)");
    console.log("=======================================================\n");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("[Seed Error]", err);
    process.exit(1);
  }
};
seedDatabase();
