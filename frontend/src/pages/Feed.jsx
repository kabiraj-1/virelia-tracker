import React, { useState } from 'react';
import './Feed.css';

const Feed = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: {
        name: 'John Doe',
        avatar: 'https://via.placeholder.com/40'
      },
      content: 'Just completed my first event! Amazing experience!',
      timestamp: '2 hours ago',
      likes: 15,
      comments: 3,
      shares: 2
    },
    {
      id: 2,
      user: {
        name: 'Sarah Smith',
        avatar: 'https://via.placeholder.com/40'
      },
      content: 'Looking forward to the community cleanup this weekend! Ìºø',
      timestamp: '4 hours ago',
      likes: 8,
      comments: 1,
      shares: 0
    }
  ]);

  const [newPost, setNewPost] = useState('');

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        user: {
          name: 'You',
          avatar: 'https://via.placeholder.com/40'
        },
        content: newPost,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        shares: 0
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  return (
    <div className="feed">
      <div className="feed-container">
        {/* Create Post Card */}
        <div className="create-post-card">
          <div className="post-input-container">
            <img 
              src="https://via.placeholder.com/40" 
              alt="Your avatar" 
              className="user-avatar"
            />
            <form onSubmit={handlePostSubmit} className="post-form">
              <input
                type="text"
                placeholder="Share your experience..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="post-input"
              />
              <button type="submit" className="post-button">
                Post
              </button>
            </form>
          </div>
        </div>

        {/* Posts Feed */}
        <div className="posts-feed">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <img 
                  src={post.user.avatar} 
                  alt={post.user.name}
                  className="post-avatar"
                />
                <div className="post-user-info">
                  <span className="user-name">{post.user.name}</span>
                  <span className="post-time">{post.timestamp}</span>
                </div>
              </div>
              
              <div className="post-content">
                {post.content}
              </div>
              
              <div className="post-actions">
                <button className="action-btn">
                  Ì±ç {post.likes}
                </button>
                <button className="action-btn">
                  Ì≤¨ {post.comments}
                </button>
                <button className="action-btn">
                  Ì¥Ñ {post.shares}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;
