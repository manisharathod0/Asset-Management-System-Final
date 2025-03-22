const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  action: { type: String, required: true },
  date: { type: Date, default: Date.now },
  user: { type: String, required: true }
});

const History = mongoose.model("History", historySchema);

module.exports = History;
