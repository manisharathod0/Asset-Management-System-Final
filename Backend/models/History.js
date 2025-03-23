
const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  action: { type: String, required: true },
  date: { type: Date, default: Date.now },
  user: { type: String, required: true },
  // Add fields to track changes in the additional properties
  quantityChange: { type: Number },
  imageChange: { type: Boolean },
  expiryDateChange: { type: Boolean }
});

const History = mongoose.model("History", historySchema);

module.exports = History;