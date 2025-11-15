const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  image: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

module.exports = mongoose.model('Post', postSchema);
