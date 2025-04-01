const express = require('express');
const router = express.Router();
const returnLogController = require('../controllers/returnLogController');
const { protect } = require('../middleware/authMiddleware'); // Assuming you have auth middleware

// Create a return log entry (protected route)
router.post('/', protect, returnLogController.createReturnLog);

// Get all return logs (admin route)
router.get('/', protect, returnLogController.getAllReturnLogs);

// Get employee's return logs
router.get('/my-returns', protect, returnLogController.getMyReturnLogs);

// Get a single return log by ID
router.get('/:id', protect, returnLogController.getReturnLogById);

// Update return log status (approve/reject)
router.patch('/:id', protect, returnLogController.updateReturnLogStatus);

// Delete a return log by ID
router.delete('/:id', protect, returnLogController.deleteReturnLog);

module.exports = router;