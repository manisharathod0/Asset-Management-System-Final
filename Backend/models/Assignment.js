const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
    asset: { type: String, required: true },
    user: { type: String, required: true },
    date: { type: Date, required: true },
    note: { type: String },
});

module.exports = mongoose.model("Assignment", AssignmentSchema);
