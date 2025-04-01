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
  processedByAdmin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ReturnLog = mongoose.model('ReturnLog', returnLogSchema);

module.exports = ReturnLog;