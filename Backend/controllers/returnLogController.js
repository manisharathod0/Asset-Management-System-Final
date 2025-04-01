const ReturnLog = require('../models/ReturnLog'); // Assuming you have this model

// Create a return log
exports.createReturnLog = async (req, res) => {
  try {
    const { assetId, name, returnDetails } = req.body;
    
    if (!assetId || !name || !returnDetails) {
      return res.status(400).json({ message: 'Required fields are missing' });
    }
    
    const newReturnLog = new ReturnLog({
      assetId,
      name,
      returnDetails
    });
    
    const savedReturnLog = await newReturnLog.save();
    
    res.status(201).json(savedReturnLog);
  } catch (error) {
    console.error('Error creating return log:', error);
    res.status(500).json({ message: 'Failed to create return log', error: error.message });
  }
};

// Get all return logs
exports.getAllReturnLogs = async (req, res) => {
  try {
    const returnLogs = await ReturnLog.find({}).sort({ 'returnDetails.returnDate': -1 });
    res.status(200).json(returnLogs);
  } catch (error) {
    console.error('Error fetching return logs:', error);
    res.status(500).json({ message: 'Failed to fetch return logs', error: error.message });
  }
};

// Get a single return log by ID
exports.getReturnLogById = async (req, res) => {
  try {
    const returnLog = await ReturnLog.findById(req.params.id);
    
    if (!returnLog) {
      return res.status(404).json({ message: 'Return log not found' });
    }
    
    res.status(200).json(returnLog);
  } catch (error) {
    console.error('Error fetching return log:', error);
    res.status(500).json({ message: 'Failed to fetch return log', error: error.message });
  }
};

// Delete a return log
exports.deleteReturnLog = async (req, res) => {
  try {
    const deletedReturnLog = await ReturnLog.findByIdAndDelete(req.params.id);
    
    if (!deletedReturnLog) {
      return res.status(404).json({ message: 'Return log not found' });
    }
    
    res.status(200).json({ message: 'Return log deleted successfully' });
  } catch (error) {
    console.error('Error deleting return log:', error);
    res.status(500).json({ message: 'Failed to delete return log', error: error.message });
  }
};