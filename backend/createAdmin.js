const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, ".env") });
const User = require("./models/User");

const createAdmin = async () => {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGODB_URI } = process.env;

  if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("ERROR: ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be defined in your environment variables (.env).");
    process.exit(1);
  }

  const mongoUri = MONGODB_URI || "mongodb://127.0.0.1:27017/pharmachain";

  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    const existingAdmin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase().trim() });
    if (existingAdmin) {
      if (existingAdmin.role === "admin") {
        existingAdmin.password = ADMIN_PASSWORD;
        await existingAdmin.save();
        console.log("Admin account already exists. Password updated successfully.");
      } else {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log("Existing user updated to Admin role.");
      }
    } else {
      await User.create({
        name: ADMIN_NAME.trim(),
        email: ADMIN_EMAIL.toLowerCase().trim(),
        password: ADMIN_PASSWORD,
        role: "admin",
        manufacturerStatus: "not_applicable"
      });
      console.log("Initial Admin account securely created.");
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
