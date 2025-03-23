const express = require('express');
const router = express.Router();
const returnLogController = require('../controllers/returnLogController');

// ➤ Create a return log entry
router.post('/', returnLogController.createReturnLog);

// ➤ Get all return logs
router.get('/', returnLogController.getAllReturnLogs);

// ➤ Get a single return log by ID
router.get('/:id', returnLogController.getReturnLogById);

// ➤ Delete a return log by ID
router.delete('/:id', returnLogController.deleteReturnLog);

module.exports = router;
