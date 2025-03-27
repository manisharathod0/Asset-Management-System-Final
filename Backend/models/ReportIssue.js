const mongoose = require("mongoose");

const reportIssueSchema = new mongoose.Schema({
  assetName: { type: String, required: true },
  assetId: { type: String, required: true },
  category: { type: String, required: true },
  issueDescription: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ReportIssue", reportIssueSchema);
