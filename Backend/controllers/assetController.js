const Assignment = require("../models/Assignment");

// Assign Asset (POST)
exports.assignAsset = async (req, res) => {
    try {
        const { asset, user, date, note } = req.body;
        const newAssignment = new Assignment({ asset, user, date, note });
        await newAssignment.save();
        res.status(201).json({ message: "Asset assigned successfully", assignment: newAssignment });
    } catch (error) {
        res.status(500).json({ error: "Failed to assign asset" });
    }
};

// Get Assigned Assets (GET)
exports.getAssignedAssets = async (req, res) => {
    try {
        const assignments = await Assignment.find();
        res.status(200).json(assignments);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch assigned assets" });
    }
};
