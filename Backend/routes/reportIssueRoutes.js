const express = require("express");
const router = express.Router();
const ReportIssue = require("../models/ReportIssue");
const Maintenance = require('../models/Maintenance'); // Assuming you have a Maintenance model

// POST: Submit a new issue report
router.post("/", async (req, res) => {
  try {
    const { assetName, assetId, category, issueDescription } = req.body;

    if (!assetName || !assetId || !category || !issueDescription) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new maintenance record instead of a report issue
    const newMaintenance = new ScheduledMaintenance({
      assetName,
      assetId,
      category,
      task: issueDescription, // Store issue as the task
      status: "pending", // Set default status as 'pending'
      date: new Date(),
    });

    await newMaintenance.save();

    res.status(201).json({ message: "Issue reported and added to maintenance schedule" });
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
