const mongoose = require('mongoose');

const returnLogSchema = new mongoose.Schema({
  assetId: {
    type: mongoose.Schema.Types.Mixed, // Can be ObjectId or another ID type
    required: true
  },
  name: {
    type: String,
    required: true
  },
  employeeId: {
    type: mongoose.Schema.Types.Mixed // User ID reference
  },
  returnDetails: {
    returnDate: {
      type: Date,
      default: Date.now
    },
    condition: {
      type: String,
      enum: ['Good', 'Minor Damage', 'Major Damage'],
      default: 'Good'
    },
    returnedBy: {
      type: String,
      required: true
    },
    notes: {
      type: String
    }
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  processedByAdmin: {
    type: Boolean,
    default: false
  },
  processedBy: {
    type: String
  },
  processedDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ReturnLog = mongoose.model('ReturnLog', returnLogSchema);

module.exports = ReturnLog;