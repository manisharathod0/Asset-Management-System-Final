const AssetRequest = require("../models/RequestNewAsset");

// Create a new asset request
exports.createAssetRequest = async (req, res) => {
  try {
    const { assetId , category, reason } = req.body;
    
    if (!assetId || !category || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    const newRequest = new AssetRequest({
      assetId,
      category,
      reason,
      status: "Pending",
      date: new Date(),
    });
    
    await newRequest.save();
    res.status(201).json({ message: "Request submitted successfully" });
  } catch (error) {
    console.error("Error submitting asset request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all asset requests
exports.getAllAssetRequests = async (req, res) => {
  try {
    const requests = await AssetRequest.find().sort({ date: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching asset requests:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get a single asset request by ID
exports.getAssetRequestById = async (req, res) => {
  try {
    const request = await AssetRequest.findById(req.params.id);
    
    if (!request) {
      return res.status(404).json({ message: "Asset request not found" });
    }
    
    res.status(200).json(request);
  } catch (error) {
    console.error("Error fetching asset request:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update asset request status
exports.updateAssetRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    
    const updatedRequest = await AssetRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!updatedRequest) {
      return res.status(404).json({ message: "Asset request not found" });
    }
    
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error("Error updating asset request status:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an asset request
exports.deleteAssetRequest = async (req, res) => {
  try {
    const deletedRequest = await AssetRequest.findByIdAndDelete(req.params.id);
    
    if (!deletedRequest) {
      return res.status(404).json({ message: "Asset request not found" });
    }
    
    res.status(200).json({ message: "Asset request deleted successfully" });
  } catch (error) {
    console.error("Error deleting asset request:", error);
    res.status(500).json({ message: "Server error" });
  }
};