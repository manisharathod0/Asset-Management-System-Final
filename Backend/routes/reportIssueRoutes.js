const express = require("express");
const router = express.Router();
const ReportIssue = require("../models/ReportIssue");

// POST: Submit a new issue report
router.post("/", async (req, res) => {
  try {
    const { assetName, assetId, category, issueDescription } = req.body;
    if (!assetName || !assetId || !category || !issueDescription) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const newIssue = new ReportIssue({ assetName, assetId, category, issueDescription });
    await newIssue.save();
    res.status(201).json({ message: "Issue reported successfully" });
  } catch (error) {
    console.error("Error reporting issue:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET: Retrieve all issue reports
router.get("/", async (req, res) => {
  try {
    const issues = await ReportIssue.find().sort({ date: -1 });
    res.status(200).json(issues);
  } catch (error) {
    console.error("Error fetching issues:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
