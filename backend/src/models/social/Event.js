const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  maxParticipants: {
    type: Number,
    default: 50
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  karmaPoints: {
    type: Number,
    default: 10
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
