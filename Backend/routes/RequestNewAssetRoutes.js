const express = require("express");
const router = express.Router();
const AssetRequest = require("../models/RequestNewAsset");

// POST /api/asset-requests
router.post("/", async (req, res) => {
  try {
    const { assetId, assetName, category, reason } = req.body;
    if (!assetId || !assetName || !category || !reason) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newRequest = new AssetRequest({
      assetId,
      assetName,
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
});

// GET route for fetching all asset requests
router.get("/", async (req, res) => {
  try {
    const requests = await AssetRequest.find().sort({ date: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching asset requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
