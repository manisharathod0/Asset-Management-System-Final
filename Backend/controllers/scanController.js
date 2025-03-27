const mongoose = require("mongoose");
const Scan = require("../models/Scan");
const Asset = require("../models/Asset");
const User = require("../models/User");

// ✅ Save scanned data
exports.saveScannedData = async (req, res) => {
  try {
    const { assetId } = req.body;
    const userId = req.user.id; // Assuming authentication middleware adds `req.user`

    if (!assetId) {
      return res.status(400).json({ message: "Asset ID is required" });
    }

    // ✅ Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(assetId)) {
      return res.status(400).json({ message: "Invalid Asset ID" });
    }

    // ✅ Check if Asset exists
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // ✅ Check if a scan already exists within 5 minutes (Prevent spam)
    const recentScan = await Scan.findOne({
      userId: userId,
      assetId: assetId,
      createdAt: { $gte: new Date(Date.now() - 5 * 60 * 1000) },
    });

    if (recentScan) {
      return res.status(409).json({ message: "Scan already recorded recently" });
    }

    // ✅ Save Scan Record
    const scanRecord = new Scan({
      userId: new mongoose.Types.ObjectId(userId),
      assetId: new mongoose.Types.ObjectId(assetId),
    });

    await scanRecord.save();
    res.status(201).json({ message: "Scanned data saved successfully" });
  } catch (error) {
    console.error("Error saving scanned data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// ✅ Get all scanned QR logs (Populated with user & asset details)
exports.getScannedLogs = async (req, res) => {
    try {
      const logs = await Scan.find()
        .populate({
          path: "userId",
          select: "name role", // ✅ Fetch user name & role
        })
        .populate({
          path: "assetId",
          select: "name", // ✅ Fetch asset name
        })
        .sort({ createdAt: -1 });
  
      res.status(200).json(logs);
    } catch (error) {
      console.error("Error fetching scan logs:", error);
      res.status(500).json({ message: "Error fetching scan logs" });
    }
  };
  
