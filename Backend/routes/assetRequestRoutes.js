const express = require('express');
const router = express.Router();
const assetRequestController = require('../controllers/assetRequestController');

// ➤ Create an asset request entry
router.post('/', assetRequestController.createAssetRequest);

// ➤ Get all asset requests
router.get('/', assetRequestController.getAllAssetRequests);

// ➤ Get a single asset request by ID
router.get('/:id', assetRequestController.getAssetRequestById);

// ➤ Delete an asset request by ID
router.delete('/:id', assetRequestController.deleteAssetRequest);

module.exports = router;
