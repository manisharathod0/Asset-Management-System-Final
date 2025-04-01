const mongoose = require("mongoose");

const assetRequestSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      required: true,
      trim: true,
    },
    assetName: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    requestedBy: {
      type: String,
      default: "Employee", // You might want to link this to a User model later
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const AssetRequest = mongoose.model("AssetRequest", assetRequestSchema);

module.exports = AssetRequest;