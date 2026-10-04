const express = require("express");
const router = express.Router();
const {
  addMedicine,
  getMedicines,
  getMedicineById,
  verifyMedicine,
  getDashboardStats
} = require("../controllers/medicineController");
const { protect, authorize, optionalAuth } = require("../middleware/authMiddleware");

// Public verification route (Accessible without login, but can track user if logged in)
router.get("/verify/:medicineId", optionalAuth, verifyMedicine);

// Protected routes
router.use(protect);

router.get("/stats/dashboard", getDashboardStats);
router.get("/", getMedicines);
router.post("/", authorize("manufacturer"), addMedicine);
router.get("/:id", getMedicineById);

module.exports = router;
