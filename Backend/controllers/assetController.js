import AssetAssignment from "../models/AssetAssignment.js"; // Assuming this is your assignment model

export const getAssignedAssets = async (req, res) => {
  try {
    const assignments = await AssetAssignment.find().populate('asset').populate('user');
    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
