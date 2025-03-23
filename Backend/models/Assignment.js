const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: "Asset", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedDate: { type: Date, required: true },
  dueDate: { type: Date },
  note: { type: String }
});

module.exports = mongoose.model("Assignment", assignmentSchema);