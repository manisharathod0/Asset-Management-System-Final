const mongoose = require('mongoose');

const maintenanceSchema = new mongoose.Schema({
  assetId: String,
  assetName: String,
  date: Date,
  technician: String,
  task: String,
  status: { type: String, default: 'pending' },
});

module.exports = mongoose.model('Maintenance', maintenanceSchema);