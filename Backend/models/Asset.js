const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Available", "Assigned", "Maintenance", "Returned"], 
    default: "Available" 
  },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  returnDetails: {
    returnedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    returnDate: { type: Date },
    condition: { type: String, enum: ["Good", "Minor Damage", "Needs Repair"] },
    notes: { type: String }
  },
  createdAt: { type: Date, default: Date.now }
});

const Asset = mongoose.model("Asset", assetSchema);
module.exports = Asset;
