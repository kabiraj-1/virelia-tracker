import React, { useState } from 'react';
import { socialService } from '../../services/social/socialService';
import { useAuth } from '../../contexts/AuthContext';

const PostCard = ({ post }) => {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState([]);
  const { user } = useAuth();

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    try {
      const response = await socialService.addComment(post._id, { content: newComment });
      setComments([response.data, ...comments]);
      setNewComment('');
    } catch (error) {
      alert('Error adding comment');
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="user-info">
          <span className="avatar">{post.author?.name?.charAt(0)}</span>
          <div>
            <strong>{post.author?.name}</strong>
            <span className="post-time">
              {new Date(post.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
      
      <p className="post-content">{post.content}</p>
      
      {post.image && (
        <img src={post.image} alt="Post" className="post-image" />
      )}

      <div className="post-actions">
        <button>❤️ {post.likes?.length || 0}</button>
        <button onClick={() => setShowComments(!showComments)}>
          💬 {post.commentCount || 0}
        </button>
        <button>🔄 Share</button>
      </div>

      {showComments && (
        <div className="comments-section">
          {user && (
            <form onSubmit={handleAddComment} className="comment-form">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              />
              <button type="submit">Post</button>
            </form>
          )}
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment._id} className="comment">
                <strong>{comment.author?.name}</strong>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostCard;