const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");

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

module.exports = router;
