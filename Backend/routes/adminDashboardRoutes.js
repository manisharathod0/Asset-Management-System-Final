// // routes/adminDashboardRoutes.js
// const express = require("express");
// const router = express.Router();
// const Asset = require("../models/Asset");
// const History = require("../models/History");

// // GET /api/dashboard/stats
// router.get("/stats", async (req, res) => {
//   try {
//     // Adjust your query conditions as per your asset model fields
//     const totalAssets = await Asset.countDocuments();
//     const assignedAssets = await Asset.countDocuments({ status: "Assigned" });
//     // If you have a "Pending" status or similar field
//     const pendingRequests = await Asset.countDocuments({ status: "Pending" });
//     const underMaintenance = await Asset.countDocuments({ status: "Under Maintenance" });

//     res.status(200).json({
//       totalAssets,
//       assignedAssets,
//       pendingRequests,
//       underMaintenance,
//     });
//   } catch (error) {
//     console.error("Error fetching dashboard stats:", error);
//     res.status(500).json({ message: "Failed to fetch dashboard stats", error: error.message });
//   }
// });

// // GET /api/dashboard/activity
// router.get("/activity", async (req, res) => {
//   try {
//     // Adjust sort and limit as needed
//     const recentActivity = await History.find()
//       .populate("asset")
//       .sort({ date: -1 })
//       .limit(10);
//     res.status(200).json(recentActivity);
//   } catch (error) {
//     console.error("Error fetching recent activity:", error);
//     res.status(500).json({ message: "Failed to fetch recent activity", error: error.message });
//   }
// });

// module.exports = router;
const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");
const History = require("../models/History");

// GET /api/dashboard/stats
router.get("/stats", async (req, res) => {
  try {
    // Count total unique assets
    const totalAssets = await Asset.countDocuments();
    
    // Calculate total quantity by summing up quantity field from all assets
    const quantityAggregation = await Asset.aggregate([
      { $group: { _id: null, totalQuantity: { $sum: "$quantity" } } }
    ]);
    const totalQuantity = quantityAggregation.length > 0 ? quantityAggregation[0].totalQuantity : 0;
    
    // Get other stats
    const assignedAssets = await Asset.countDocuments({ status: "Assigned" });
    const pendingRequests = await Asset.countDocuments({ status: "Pending" });
    const underMaintenance = await Asset.countDocuments({ status: "Under Maintenance" });
    
    res.status(200).json({
      totalAssets,
      totalQuantity,
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

// GET /api/dashboard/categories - Added new endpoint for category statistics with quantity
router.get("/categories", async (req, res) => {
  try {
    const categoryStats = await Asset.aggregate([
      { 
        $group: { 
          _id: "$category", 
          count: { $sum: 1 }, 
          totalQuantity: { $sum: "$quantity" } 
        } 
      },
      { 
        $project: { 
          _id: 0, 
          category: "$_id", 
          count: 1, 
          totalQuantity: 1 
        } 
      }
    ]);
    
    res.status(200).json(categoryStats);
  } catch (error) {
    console.error("Error fetching category stats:", error);
    res.status(500).json({ message: "Failed to fetch category statistics", error: error.message });
  }
});

module.exports = router;