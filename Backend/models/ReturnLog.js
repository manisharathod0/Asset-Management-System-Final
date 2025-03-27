const mongoose = require('mongoose');

const returnLogSchema = new mongoose.Schema({
  asset: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Asset',
    required: true
  },
  returnedBy: {
    type: String,
    required: true
  },
  returnDate: {
    type: Date,
    default: Date.now

  },
  condition: {
    type: String,
    enum: ['Good', 'Damaged', 'Needs Repair'],
    required: true
  },
  notes: {
    type: String
  }
}, { timestamps: true });

module.exports = mongoose.model('ReturnLog', returnLogSchema);
