const express = require("express");
const { assignAsset, getAssignedAssets, unassignAsset } = require("../controllers/assignmentController");

const router = express.Router();

// Assign an asset
router.post("/", assignAsset);

// Get all assigned assets
router.get("/assigned", getAssignedAssets);

// Unassign an asset
router.delete("/unassign/:id", unassignAsset);

module.exports = router;