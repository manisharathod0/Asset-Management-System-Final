const Assignment = require("../models/Assignment");
const mongoose = require("mongoose");
const Asset = require("../models/Asset"); // Import Asset model

const assignAsset = async (req, res) => {
  try {
    const { assetId, userId, assignedDate, dueDate, note } = req.body;

    // Check if asset exists
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    // Create assignment record
    const assignment = new Assignment({
      asset: assetId,
      user: userId,
      assignedDate,
      dueDate,
      note,
    });
    await assignment.save();

    // Update asset status to "Assigned"
    asset.status = "Assigned";
    await asset.save();

    res.status(201).json({ message: "Asset assigned successfully", assignment });
  } catch (error) {
    res.status(500).json({ message: "Error assigning asset", error });
  }
};

// Get all assigned assets
const getAssignedAssets = async (req, res) => {
  try {
    const assignedAssets = await Assignment.find().populate("asset user");
    res.json(assignedAssets);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assigned assets", error });
  }
};

// Get assets assigned to the logged-in user
const getMyAssets = async (req, res) => {
  try {
    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    const userId = new mongoose.Types.ObjectId(req.user._id); // Convert to ObjectId

    // Fetch assigned assets for the logged-in user
    const assignedAssets = await Assignment.find({ user: userId })
      .populate("asset", "name status") // Fetch only name & status
      .sort({ assignedDate: -1 });

    if (!assignedAssets.length) {
      return res.status(404).json({ message: "No assets assigned to this user" });
    }

    // Debugging: Ensure `name` and `status` exist
    assignedAssets.forEach((assignment) => {
      if (!assignment.asset || !assignment.asset.name || !assignment.asset.status) {
        console.warn("⚠️ Missing asset data:", assignment);
      }
    });

    res.json(assignedAssets);
  } catch (error) {
    console.error("❌ Error fetching assigned assets:", error.message);
    res.status(500).json({ message: "Server Error", error });
  }
};

// Unassign an asset
const unassignAsset = async (req, res) => {
  try {
    const { id } = req.params;
    await Assignment.findByIdAndDelete(id);
    res.json({ message: "Asset unassigned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unassigning asset", error });
  }
};

module.exports = { assignAsset, getAssignedAssets, getMyAssets, unassignAsset };