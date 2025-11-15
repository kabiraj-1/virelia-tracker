const mongoose = require('mongoose');

const karmaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  points: {
    type: Number,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['event_participation', 'event_creation', 'post_creation', 'helpful_comment'],
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Karma', karmaSchema);