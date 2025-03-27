const express = require("express");
const { assignAsset, getAssignedAssets, unassignAsset, getMyAssets } = require("../controllers/assignmentController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Get assets assigned to the logged-in user
router.get("/my-assets", protect, getMyAssets);

// Assign an asset
router.post("/", assignAsset);

// Get all assigned assets
router.get("/assigned", getAssignedAssets);

// Unassign an asset
router.delete("/unassign/:id", unassignAsset);

module.exports = router;
