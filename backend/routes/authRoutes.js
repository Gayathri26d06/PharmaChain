const express = require("express");
const router = express.Router();
const { register, login, getProfile, googleLogin } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/google", googleLogin);

// Protected routes
router.get("/profile", protect, getProfile);

module.exports = router;
