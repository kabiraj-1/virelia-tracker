import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Feed.css';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load mock posts
  useEffect(() => {
    const mockPosts = [
      {
        _id: '1',
        user: { username: 'sarah', _id: '123' },
        content: 'Just completed my morning run! Feeling amazing and ready to tackle the day! #fitness #goals',
        createdAt: new Date().toISOString(),
        likes: [{ user: { _id: '124' } }],
        comments: [
          {
            user: { username: 'mike' },
            content: 'Awesome work Sarah! Keep it up!',
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        _id: '2', 
        user: { username: 'mike', _id: '124' },
        content: 'Working on my coding skills. Completed 3 hours of practice today! #programming #learning',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes: [{ user: { _id: '123' } }, { user: { _id: '125' } }],
        comments: [
          {
            user: { username: 'sarah' },
            content: 'Great job Mike! What are you learning?',
            createdAt: new Date().toISOString()
          }
        ]
      },
      {
        _id: '3',
        user: { username: 'alex', _id: '125' },
        content: 'Just hit my savings goal for this month! Financial discipline pays off. #finance #goals',
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        likes: [{ user: { _id: '123' } }, { user: { _id: '124' } }],
        comments: []
      }
    ];
    setPosts(mockPosts);
  }, []);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      setLoading(true);
      setError('');
      
      // Create a new post
      const newPost = {
        _id: Date.now().toString(),
        user: { username: user.username, _id: user.id },
        content: content.trim(),
        createdAt: new Date().toISOString(),
        likes: [],
        comments: []
      };

      setPosts(prev => [newPost, ...prev]);
      setContent('');
      setSuccess('Post created successfully!');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    setPosts(prev => prev.map(post => {
      if (post._id === postId) {
        const isLiked = post.likes.some(like => like.user._id === user.id);
        if (isLiked) {
          return {
            ...post,
            likes: post.likes.filter(like => like.user._id !== user.id)
          };
        } else {
          return {
            ...post,
            likes: [...post.likes, { user: { _id: user.id } }]
          };
        }
      }
      return post;
    }));
  };

  return (
    <div className="feed">
      <div className="feed-header">
        <h1>Social Feed</h1>
        <p>Share your progress and connect with friends</p>
      </div>

      {/* Create Post Form */}
      <div className="create-post-section">
        <form onSubmit={handleCreatePost} className="post-form">
          <div className="post-input-container">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind? Share your progress, achievements, or thoughts..."
              rows="3"
              maxLength="500"
              className="post-textarea"
            />
            <div className="post-actions">
              <div className="char-count">{content.length}/500</div>
              <button 
                type="submit" 
                disabled={!content.trim() || loading}
                className="post-submit-btn"
              >
                {loading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
        </form>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </div>

      {/* Posts Feed */}
      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="empty-feed">
            <div className="empty-icon">Ì≥ù</div>
            <h3>No posts yet</h3>
            <p>Be the first to share your progress!</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              currentUser={user}
            />
          ))
        )}
      </div>
    </div>
  );
};

const PostCard = ({ post, onLike, currentUser }) => {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const isLiked = post.likes.some(like => like.user._id === currentUser.id);
  const likeCount = post.likes.length;
  const commentCount = post.comments.length;

  const handleAddComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      alert('Comment functionality will be fully integrated with the backend soon!');
      setComment('');
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="user-avatar">
          {post.user.username?.charAt(0).toUpperCase()}
        </div>
        <div className="post-user-info">
          <h4>{post.user.username}</h4>
          <span className="post-date">
            {new Date(post.createdAt).toLocaleDateString()} at{' '}
            {new Date(post.createdAt).toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
      </div>

      <div className="post-stats">
        <span>{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
        <span>{commentCount} {commentCount === 1 ? 'comment' : 'comments'}</span>
      </div>

      <div className="post-actions">
        <button 
          className={`like-btn ${isLiked ? 'liked' : ''}`}
          onClick={() => onLike(post._id)}
        >
          {isLiked ? '‚ù§Ô∏è Liked' : 'Ì¥ç Like'}
        </button>
        <button 
          className="comment-btn"
          onClick={() => setShowComments(!showComments)}
        >
          Ì≤¨ Comment
        </button>
      </div>

      {showComments && (
        <div className="post-comments">
          <div className="comments-list">
            {post.comments.map((comment, index) => (
              <div key={index} className="comment">
                <div className="comment-avatar">
                  {comment.user.username?.charAt(0).toUpperCase()}
                </div>
                <div className="comment-content">
                  <strong>{comment.user.username}</strong>
                  <p>{comment.content}</p>
                  <span className="comment-date">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <form onSubmit={handleAddComment} className="comment-form">
            <input
              type="text"
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button type="submit">Post</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Feed;
