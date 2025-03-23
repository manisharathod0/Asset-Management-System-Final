

// const mongoose = require("mongoose");
// // Change in your Asset.js model
// const assetSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   category: { type: String, required: true },
//   status: { 
//     type: String, 
//     enum: ["Available", "Assigned", "Under Maintenance", "Retired"], 
//     default: "Available" 
//   },
//   // Rest of the schema remains the same
//   description: { type: String },
//   quantity: { type: Number, default: 1 },
//   expiryDate: { type: Date },
//   image: { type: String },
//   assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
//   returnDetails: {
//     returnedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
//     returnDate: { type: Date },
//     condition: { type: String, enum: ["Good", "Minor Damage", "Needs Repair"] },
//     notes: { type: String }
//   },
//   createdAt: { type: Date, default: Date.now }
// });

// const Asset = mongoose.model("Asset", assetSchema);
// module.exports = Asset;


const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Asset name is required"],
    trim: true
  },
  category: { 
    type: String, 
    required: [true, "Category is required"],
    trim: true
  },
  status: {
    type: String,
    enum: {
      values: ["Available", "Assigned", "Under Maintenance", "Retired"],
      message: "Status must be one of: Available, Assigned, Under Maintenance, Retired"
    },
    default: "Available",
    trim: true
  },
  description: { 
    type: String,
    default: "",
    trim: true 
  },
  quantity: { 
    type: Number, 
    default: 1,
    min: [0, "Quantity cannot be negative"] 
  },
  expiryDate: { 
    type: Date,
    validate: {
      validator: function(value) {
        return value === null || value === undefined || value instanceof Date;
      },
      message: "Invalid date format"
    }
  },
  image: { 
    type: String,
    trim: true 
  },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null 
  },
  returnDetails: {
    returnedBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      default: null 
    },
    returnDate: { 
      type: Date 
    },
    condition: { 
      type: String, 
      enum: ["Good", "Minor Damage", "Needs Repair"] 
    },
    notes: { 
      type: String,
      trim: true 
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Asset = mongoose.model("Asset", assetSchema);

module.exports = Asset;