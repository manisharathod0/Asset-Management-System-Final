// routes/adminDashboardRoutes.js
const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");
const History = require("../models/History");

// GET /api/dashboard/stats
router.get("/stats", async (req, res) => {
  try {
    // Adjust your query conditions as per your asset model fields
    const totalAssets = await Asset.countDocuments();
    const assignedAssets = await Asset.countDocuments({ status: "Assigned" });
    // If you have a "Pending" status or similar field
    const pendingRequests = await Asset.countDocuments({ status: "Pending" });
    const underMaintenance = await Asset.countDocuments({ status: "Under Maintenance" });

    res.status(200).json({
      totalAssets,
      assignedAssets,
      pendingRequests,
      underMaintenance,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
  }
});

// GET /api/dashboard/activity
router.get("/activity", async (req, res) => {
  try {
    // Adjust sort and limit as needed
    const recentActivity = await History.find()
      .populate("asset")
      .sort({ date: -1 })
      .limit(10);
    res.status(200).json(recentActivity);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({ message: "Failed to fetch recent activity", error: error.message });
  }
});

module.exports = router;
