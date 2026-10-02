const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return;
  }

  const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pharmachain";

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 4000
    });

    isConnected = true;
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    console.log(`[MongoDB] Active Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`\n[MongoDB Warning] Could not establish connection to: ${mongoUri}`);
    console.error(`[MongoDB Error]   ${error.message}`);
    console.log("[MongoDB Tip] Ensure MongoDB service is running locally (`mongod`), or set MONGODB_URI in backend/.env to a free MongoDB Atlas cloud cluster.");
    console.log("[MongoDB Notice] PharmaChain backend will continue running and serve blockchain queries & diagnostics.\n");
  }
};

module.exports = connectDB;
