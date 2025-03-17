const express = require("express");
const router = express.Router();
const History = require("../models/History");

// ➤ Get all history entries
router.get("/", async (req, res) => {
  try {
    const history = await History.find().populate("asset");
    res.status(200).json(history);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ error: error.message });
  }
});

// ➤ Add a new history entry
router.post("/", async (req, res) => {
  try {
    const { asset, action, user } = req.body;
    const history = new History({ asset, action, user });
    await history.save();
    res.status(201).json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;