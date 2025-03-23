const mongoose = require("mongoose");

const scanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  assetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Asset", 
    required: true,
  },
  scanDate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Scan", scanSchema);
