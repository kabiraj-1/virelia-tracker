const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  image: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event'
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  commentCount: {
    type: Number,
    default: 0
  },
  tags: [String]
}, {
  timestamps: true
});

postSchema.index({ author: 1, createdAt: -1 });
postSchema.index({ eventId: 1 });

module.exports = mongoose.model('Post', postSchema);