const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: {
      validator: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      },
      message: 'Please provide a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  avatar: {
    type: String,
    default: 'https://res.cloudinary.com/kabiraj/image/upload/v1700000000/default-avatar.png'
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: 'í¼Ÿ Passionate social media enthusiast'
  },
  karma: {
    type: Number,
    default: 100
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'expert', 'master'],
    default: 'beginner'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'auto'
    },
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  },
  socialLinks: {
    website: String,
    twitter: String,
    linkedin: String,
    github: String
  },
  statistics: {
    postsCount: { type: Number, default: 0 },
    eventsCreated: { type: Number, default: 0 },
    eventsAttended: { type: Number, default: 0 },
    karmaEarned: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for user activity score
userSchema.virtual('activityScore').get(function() {
  const postsWeight = this.statistics.postsCount * 2;
  const eventsWeight = (this.statistics.eventsCreated + this.statistics.eventsAttended) * 3;
  const karmaWeight = this.statistics.karmaEarned * 0.1;
  return postsWeight + eventsWeight + karmaWeight;
});

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ karma: -1 });
userSchema.index({ 'statistics.postsCount': -1 });

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison method
userSchema.methods.correctPassword = async function(candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Update last active
userSchema.methods.updateLastActive = function() {
  this.lastActive = new Date();
  return this.save({ validateBeforeSave: false });
};

// Check if user is active (within last 7 days)
userSchema.methods.isActive = function() {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return this.lastActive > sevenDaysAgo;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
