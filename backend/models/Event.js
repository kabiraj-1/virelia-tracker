import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'environment', 'education', 'healthcare', 
      'community', 'animals', 'elderly', 
      'children', 'disaster_relief', 'other'
    ]
  },
  location: {
    address: String,
    city: String,
    country: String,
    online: {
      type: Boolean,
      default: false
    }
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  volunteers: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['registered', 'attended', 'completed', 'cancelled'],
      default: 'registered'
    }
  }],
  dateTime: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  capacity: {
    type: Number,
    default: 0
  },
  karmaPoints: {
    type: Number,
    default: 10
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'ongoing', 'completed', 'cancelled'],
    default: 'draft'
  }
}, {
  timestamps: true
});

export default mongoose.model('Event', eventSchema);
