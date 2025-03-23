const express = require("express");
const { saveScannedData,getScannedLogs } = require("../controllers/scanController");
const { protect } = require("../middleware/authMiddleware"); // Ensure auth middleware exists

const router = express.Router();

router.post("/scanned-data", protect, saveScannedData); // Protect route

router.get("/logs", protect, getScannedLogs);

module.exports = router;
