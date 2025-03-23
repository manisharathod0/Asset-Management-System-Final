const express = require('express');
const router = express.Router();
const { assignAsset, unassignAsset, getAssignments } = require('../controllers/assignAssetController');
const { protect } = require('../middleware/authMiddleware');

// Assign Asset
router.post('/assign', protect, assignAsset);

// Unassign Asset
router.post('/unassign', protect, unassignAsset);

// Get All Assignments
router.get('/', protect, getAssignments);

module.exports = router;
