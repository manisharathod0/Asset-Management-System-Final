const Assignment = require("../models/Assignment");

// Assign an asset
const assignAsset = async (req, res) => {
  try {
    const { assetId, userId, assignedDate, dueDate, note } = req.body;
    const assignment = new Assignment({
      asset: assetId,
      user: userId,
      assignedDate,
      dueDate,
      note,
    });
    await assignment.save();
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

module.exports = { assignAsset, getAssignedAssets, unassignAsset };