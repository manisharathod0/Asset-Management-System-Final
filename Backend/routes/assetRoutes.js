const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");
const { assignAsset, getAssignedAssets } = require("../controllers/assetController");//dont delete

// ➤ Add a new asset
router.post("/", async (req, res) => {
  try {
    const { name, category, status } = req.body;
    const asset = new Asset({ name, category, status });
    await asset.save();
    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Get all assets
router.get("/", async (req, res) => {
  try {
    const assets = await Asset.find();
    res.status(200).json(assets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Update an asset
router.put("/:id", async (req, res) => {
  try {
    const asset = await Asset.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(asset);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ Delete an asset
router.delete("/:id", async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Asset deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


router.post("/assign", async (req, res) => {
  try {
    const { assetId, assignedTo } = req.body;

    if (!assetId || !assignedTo) {
      return res.status(400).json({ error: "Asset ID and Assigned User are required" });
    }

    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ error: "Asset not found" });
    }

    // ✅ Correct: Only update existing asset
    asset.status = "Assigned";
    asset.assignedTo = assignedTo;
    await asset.save();

    res.status(200).json({ message: "Asset assigned successfully", asset });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error", details: error.message });
  }
});

// Mark an Asset as Returned
router.put("/return/:id", async (req, res) => {
  const { returnedBy, returnDate, condition, notes } = req.body;

  try {
    const asset = await Asset.findById(req.params.id);
    if (!asset) return res.status(404).json({ error: "Asset not found" });

    asset.status = "Returned";
    asset.assignedTo = null;
    asset.returnDetails = { returnedBy, returnDate, condition, notes };

    await asset.save();
    res.json({ message: "Asset returned successfully", asset });
  } catch (error) {
    res.status(500).json({ error: "Error updating asset return details" });
  }
});

// Fetch only returned assets
router.get("/returned", async (req, res) => {
  try {
    const returnedAssets = await Asset.find({ status: "Returned" }).populate("returnDetails.returnedBy", "name");
    res.json(returnedAssets);
  } catch (error) {
    res.status(500).json({ error: "Server error fetching returned assets" });
  }
});

// Get all asset requests
router.get("/", async (req, res) => {
  try {
    const requests = await AssetRequest.find();
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new asset request
router.post("/", async (req, res) => {
  const { asset, requestedBy } = req.body;
  
  try {
    const newRequest = new AssetRequest({ asset, requestedBy });
    await newRequest.save();
    res.status(201).json(newRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update asset request status
router.patch("/:id", async (req, res) => {
  try {
    const updatedRequest = await AssetRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json(updatedRequest);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete an asset request
router.delete("/:id", async (req, res) => {
  try {
    await AssetRequest.findByIdAndDelete(req.params.id);
    res.json({ message: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



module.exports = router;
