const mongoose = require("mongoose");

const RequestNewAssetSchema = new mongoose.Schema({
  assetId: { type: String, required: true },
  assetName: { type: String, required: true },
  category: { type: String, required: true },
  reason: { type: String, required: true },
  status: { type: String, default: "Pending" },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("RequestNewAsset", RequestNewAssetSchema);
