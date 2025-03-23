const ReturnLog = require('../models/ReturnLog');
const Asset = require('../models/Asset');

// ➤ Create a return log entry
exports.createReturnLog = async (req, res) => {
  try {
    const { assetId, returnedBy, conditionStatus, comments } = req.body;

    // Validate required fields
    if (!assetId || !returnedBy || !conditionStatus) {
      return res.status(400).json({ message: 'Asset ID, Returned By, and Condition Status are required' });
    }

    // Check if the asset exists
    const asset = await Asset.findById(assetId);
    if (!asset) {
      return res.status(404).json({ message: 'Asset not found' });
    }

    // Create return log entry
    const returnLog = new ReturnLog({
      asset: assetId,
      returnedBy,
      conditionStatus,
      comments,
    });

    await returnLog.save();

    res.status(201).json({ message: 'Return log created successfully', returnLog });
  } catch (error) {
    console.error('Error creating return log:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// ➤ Get all return logs
exports.getAllReturnLogs = async (req, res) => {
  try {
    const returnLogs = await ReturnLog.find().populate('asset');
    res.status(200).json(returnLogs);
  } catch (error) {
    console.error('Error fetching return logs:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// ➤ Get a single return log by ID
exports.getReturnLogById = async (req, res) => {
  try {
    const returnLog = await ReturnLog.findById(req.params.id).populate('asset');
    if (!returnLog) {
      return res.status(404).json({ message: 'Return log not found' });
    }
    res.status(200).json(returnLog);
  } catch (error) {
    console.error('Error fetching return log:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};

// ➤ Delete a return log by ID
exports.deleteReturnLog = async (req, res) => {
  try {
    const returnLog = await ReturnLog.findByIdAndDelete(req.params.id);
    if (!returnLog) {
      return res.status(404).json({ message: 'Return log not found' });
    }
    res.status(200).json({ message: 'Return log deleted successfully' });
  } catch (error) {
    console.error('Error deleting return log:', error);
    res.status(500).json({ message: 'Internal server error', error });
  }
};
