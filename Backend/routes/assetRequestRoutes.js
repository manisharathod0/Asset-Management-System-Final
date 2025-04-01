const express = require('express');
const router = express.Router();
const assetRequestController = require('../controllers/assetRequestController');

// Create an asset request
router.post('/', assetRequestController.createAssetRequest);

// Get all asset requests
router.get('/', assetRequestController.getAllAssetRequests);

// Get a single asset request by ID
router.get('/:id', assetRequestController.getAssetRequestById);

// Update asset request status
router.patch('/:id', assetRequestController.updateAssetRequestStatus);

// Delete an asset request
router.delete('/:id', assetRequestController.deleteAssetRequest);

module.exports = router;