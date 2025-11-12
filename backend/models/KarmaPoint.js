import mongoose from 'mongoose';

const karmaPointSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  event: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
    required: true
  },
  points: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    required: true,
    enum: [
      'event_participation',
      'event_organization',
      'community_contribution'
    ]
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

export default mongoose.model('KarmaPoint', karmaPointSchema);
