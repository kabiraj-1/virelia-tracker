import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Feed.css';

const Feed = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!newPost.trim()) return;
    
    // TODO: Connect to backend API
    const post = {
      id: Date.now(),
      content: newPost,
      author: user?.name || 'User',
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: []
    };
    
    setPosts([post, ...posts]);
    setNewPost('');
  };

  return (
    <div className="feed">
      <div className="feed-header">
        <h1>Feed Ì≥ù</h1>
        <p>Share updates and see what others are working on</p>
      </div>

      {/* Create Post */}
      <div className="create-post">
        <div className="post-header">
          <div className="user-avatar">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="post-input">
            <form onSubmit={handlePostSubmit}>
              <textarea
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                rows="3"
              />
              <button type="submit" className="post-btn">
                Post
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="posts-feed">
        {posts.length === 0 ? (
          <div className="empty-feed">
            <div className="empty-icon">Ì≥ù</div>
            <h3>No posts yet</h3>
            <p>Be the first to share an update! Post about your progress, goals, or achievements.</p>
            <div className="post-suggestions">
              <h4>What to share:</h4>
              <ul>
                <li>Completed goals or milestones</li>
                <li>Current projects you're working on</li>
                <li>Productivity tips and insights</li>
                <li>Challenges you're overcoming</li>
              </ul>
            </div>
          </div>
        ) : (
          posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <div className="user-avatar">
                  {post.author.charAt(0)}
                </div>
                <div className="post-info">
                  <h4>{post.author}</h4>
                  <span>{new Date(post.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="post-content">
                <p>{post.content}</p>
              </div>
              <div className="post-actions">
                <button className="like-btn">‚ù§Ô∏è {post.likes}</button>
                <button className="comment-btn">Ì≤¨ {post.comments.length}</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Feed;
