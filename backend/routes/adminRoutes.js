const express = require("express");
const router = express.Router();
const { getManufacturers, createManufacturer, deleteManufacturer, getAdminStats, getAllMedicines, getAuditLogs } = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.use(authorize("admin"));

router.get("/manufacturers", getManufacturers);
router.post("/manufacturers", createManufacturer);
router.delete("/manufacturers/:id", deleteManufacturer);

router.get("/stats", getAdminStats);
router.get("/medicines", getAllMedicines);
router.get("/logs", getAuditLogs);

module.exports = router;
