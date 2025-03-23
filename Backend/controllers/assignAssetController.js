const Assignment = require("../models/Assignment");
const Asset = require("../models/Asset");
const User = require("../models/User");

// Assign Asset
const assignAsset = async (req, res) => {
  const { assetId, userId, assignedDate, dueDate, note } = req.body;

  try {
    const asset = await Asset.findById(assetId);
    const user = await User.findById(userId);

    if (!asset || !user) {
      return res.status(404).json({ message: "Asset or User not found" });
    }

    if (asset.status !== 'Available') {
      return res.status(400).json({ message: "Asset is not available for assignment" });
    }

    const assignment = new Assignment({
      asset: assetId,
      user: userId,
      assignedDate,
      dueDate,
      note,
    });

    await assignment.save();

    asset.status = 'Assigned';
    asset.assignedTo = userId;
    await asset.save();

    res.status(201).json({ message: "Asset assigned successfully", assignment });
  } catch (error) {
    res.status(500).json({ message: "Error assigning asset", error });
  }
};

// Unassign Asset
const unassignAsset = async (req, res) => {
  const { assignmentId } = req.body;

  try {
    const assignment = await Assignment.findById(assignmentId);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    const asset = await Asset.findById(assignment.asset);
    if (asset) {
      asset.status = 'Available';
      asset.assignedTo = null;
      await asset.save();
    }

    assignment.status = 'Unassigned';
    await assignment.save();

    res.status(200).json({ message: "Asset unassigned successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unassigning asset", error });
  }
};

// Get All Assignments
const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().populate('asset', 'name status').populate('user', 'name');
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching assignments", error });
  }
};

module.exports = { assignAsset, unassignAsset, getAllAssignments };
