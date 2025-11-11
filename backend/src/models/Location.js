import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true,
    index: true
  },
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  metadata: {
    accuracy: Number,
    altitude: Number,
    altitudeAccuracy: Number,
    speed: Number,
    heading: Number,
    timestamp: {
      type: Date,
      default: Date.now
    },
    batteryLevel: Number,
    networkType: String,
    isCharging: Boolean
  }
}, {
  timestamps: true
});

// 2dsphere index for geospatial queries
locationSchema.index({ coordinates: '2dsphere' });

// Compound indexes for common queries
locationSchema.index({ user: 1, createdAt: -1 });
locationSchema.index({ session: 1, createdAt: -1 });
locationSchema.index({ createdAt: 1 });

// Virtual for formatted address (can be populated from reverse geocoding)
locationSchema.virtual('address').get(function() {
  // This would typically be populated from a geocoding service
  return this._address;
});

locationSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

export default mongoose.model('Location', locationSchema);