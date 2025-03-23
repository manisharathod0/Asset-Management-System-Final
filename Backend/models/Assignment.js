const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedDate: { type: Date, required: true },
  dueDate: { type: Date },
  status: { type: String, enum: ['Assigned', 'Unassigned'], default: 'Assigned' },
  note: { type: String },
}, { timestamps: true });

module.exports = mongoose.model("Assignment", AssignmentSchema);
