import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import socialService from '../../services/socialService';
import CreatePost from './CreatePost';
import './SocialFeed.css';

const SocialFeed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadFeed();
  }, [currentPage]);

  const loadFeed = async () => {
    try {
      setLoading(true);
      const feedData = await socialService.getFeed(currentPage, 10);
      setPosts(feedData.posts);
      setTotalPages(feedData.totalPages);
    } catch (error) {
      setError('Failed to load feed');
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const result = await socialService.likePost(postId);
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              likes: result.liked 
                ? [...post.likes, { user: { _id: user.id, username: user.username } }]
                : post.likes.filter(like => like.user._id !== user.id)
            } 
          : post
      ));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleAddComment = async (postId, content) => {
    try {
      const newComment = await socialService.addComment(postId, content);
      setPosts(prev => prev.map(post => 
        post._id === postId 
          ? { ...post, comments: [...post.comments, newComment] }
          : post
      ));
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleNewPost = (newPost) => {
    setPosts(prev => [newPost, ...prev]);
  };

  if (loading && posts.length === 0) {
    return (
      <div className="social-feed">
        <div className="loading">Loading feed...</div>
      </div>
    );
  }

  return (
    <div className="social-feed">
      <div className="feed-header">
        <h1>Ì≥± Social Feed</h1>
        <p>See what your friends are achieving</p>
      </div>

      <CreatePost onPostCreated={handleNewPost} />

      {error && <div className="error-message">{error}</div>}

      <div className="posts-container">
        {posts.length === 0 ? (
          <div className="empty-feed">
            <div className="empty-icon">Ì≥ù</div>
            <h3>No posts yet</h3>
            <p>Be the first to share your progress or connect with more friends!</p>
          </div>
        ) : (
          posts.map(post => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              onAddComment={handleAddComment}
              currentUser={user}
            />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const PostCard = ({ post, onLike, onAddComment, currentUser }) => {
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const isLiked = post.likes.some(like => like.user._id === currentUser.id);
  const likeCount = post.likes.length;
  const commentCount = post.comments.length;

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onAddComment(post._id, comment.trim());
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
          {post.goal && (
            <span className="post-goal">ÌøÜ {post.goal.title}</span>
          )}
        </div>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        
        {post.media && post.media.length > 0 && (
          <div className="post-media">
            {post.media.map((media, index) => (
              media.mimetype.startsWith('image/') ? (
                <img key={index} src={media.url} alt="Post media" />
              ) : (
                <video key={index} controls>
                  <source src={media.url} type={media.mimetype} />
                </video>
              )
            ))}
          </div>
        )}
      </div>

      <div className="post-stats">
        <span>{likeCount} likes</span>
        <span>{commentCount} comments</span>
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
            {post.comments.map(comment => (
              <div key={comment._id} className="comment">
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
          
          <form onSubmit={handleSubmitComment} className="comment-form">
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

export default SocialFeed;
