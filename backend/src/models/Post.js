import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 2000
  },
  media: [{
    url: String,
    mimetype: String
  }],
  goal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal'
  },
  scheduledPublish: {
    type: Date,
    default: null
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  visibility: {
    type: String,
    enum: ['public', 'friends', 'private'],
    default: 'friends'
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

export default mongoose.model('Post', postSchema);
