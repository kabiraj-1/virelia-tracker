const Post = require('../../models/social/Post');
const Comment = require('../../models/social/Comment');

class FeedController {
  async createPost(req, res) {
    try {
      const post = new Post({
        content: req.body.content,
        author: req.user.id,
        image: req.body.image
      });
      await post.save();
      
      const populatedPost = await Post.findById(post._id)
        .populate('author', 'name email avatar');
      
      res.status(201).json({ success: true, data: populatedPost });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  async getFeed(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const posts = await Post.find()
        .populate('author', 'name email avatar karmaPoints')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await Post.countDocuments();

      res.json({
        success: true,
        data: {
          posts,
          pagination: {
            current: page,
            pages: Math.ceil(total / limit),
            total
          }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async addComment(req, res) {
    try {
      const comment = new Comment({
        content: req.body.content,
        postId: req.params.postId,
        author: req.user.id
      });
      await comment.save();

      await Post.findByIdAndUpdate(req.params.postId, {
        $inc: { commentCount: 1 }
      });

      const populatedComment = await Comment.findById(comment._id)
        .populate('author', 'name email avatar');

      res.status(201).json({ success: true, data: populatedComment });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = new FeedController();
