const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables
dotenv.config();

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Import Route Handlers
const authRoutes = require("./routes/authRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const blockchainRoutes = require("./routes/blockchainRoutes");
const adminRoutes = require("./routes/adminRoutes");

// Initialize Database connection
connectDB();

const app = express();

// Middleware
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger (Development)
if (process.env.NODE_ENV !== "test") {
  app.use((req, res, next) => {
    console.log(`[HTTP] ${req.method} ${req.originalUrl}`);
    next();
  });
}

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "HEALTHY",
    service: "PharmaChain REST API & Blockchain Relayer",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/blockchain", blockchainRoutes);
app.use("/api/admin", adminRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log("\n=======================================================");
  console.log("   PharmaChain Backend & Blockchain Relayer Started   ");
  console.log("=======================================================");
  console.log(`[Port]          http://localhost:${PORT}`);
  console.log(`[Environment]   ${process.env.NODE_ENV || "development"}`);
  console.log(`[Health Check]  http://localhost:${PORT}/api/health`);
  console.log("=======================================================\n");
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error(`[Unhandled Rejection] ${err.message}`);
});

module.exports = app;
