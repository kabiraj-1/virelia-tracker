import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  settings: {
    updateInterval: {
      type: Number,
      default: 30000, // 30 seconds
      min: 5000, // 5 seconds minimum
      max: 300000 // 5 minutes maximum
    },
    shareWith: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    autoStop: {
      enabled: {
        type: Boolean,
        default: false
      },
      duration: {
        type: Number, // in minutes
        default: 60
      }
    }
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: Date
}, {
  timestamps: true
});

// Indexes
sessionSchema.index({ user: 1, isActive: -1 });
sessionSchema.index({ isActive: 1, lastActivity: -1 });
sessionSchema.index({ createdAt: -1 });

// Virtual for duration
sessionSchema.virtual('duration').get(function() {
  const end = this.endTime || new Date();
  return Math.round((end - this.startTime) / 1000); // duration in seconds
});

// Method to check if session should auto-stop
sessionSchema.methods.shouldAutoStop = function() {
  if (!this.settings.autoStop.enabled || !this.isActive) {
    return false;
  }
  
  const autoStopTime = new Date(this.lastActivity.getTime() + this.settings.autoStop.duration * 60000);
  return new Date() > autoStopTime;
};

// Static method to find expired sessions
sessionSchema.statics.findExpiredSessions = function() {
  const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
  return this.find({
    isActive: true,
    lastActivity: { $lt: cutoffTime }
  });
};

sessionSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('Session', sessionSchema);