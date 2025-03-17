// const mongoose = require("mongoose");

// const assetSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   category: { type: String, required: true },
//   status: { type: String, enum: ["Available", "Assigned", "Maintenance"], default: "Available" },
//   createdAt: { type: Date, default: Date.now }
// });

// const Asset = mongoose.model("Asset", assetSchema);

// module.exports = Asset;


const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  status: { 
    type: String, 
    enum: ["Available", "Assigned", "Under Maintenance", "Retired"], 
    default: "Available" 
  },
  description: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

const Asset = mongoose.model("Asset", assetSchema);

module.exports = Asset;