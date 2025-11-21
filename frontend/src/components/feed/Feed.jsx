import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Feed = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([
    {
      id: 1,
      user: { name: 'Alex Johnson', avatar: null },
      content: 'Just completed my daily productivity goal! ÌæØ',
      timestamp: '2 hours ago',
      likes: 12,
      comments: 3,
      isLiked: false
    },
    {
      id: 2,
      user: { name: 'Sarah Chen', avatar: null },
      content: 'Working on a new feature for our social tracker. So excited! Ì≤ª',
      timestamp: '4 hours ago',
      likes: 8,
      comments: 1,
      isLiked: true
    }
  ]);

  const [newPost, setNewPost] = useState('');

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked
          }
        : post
    ));
  };

  const handleAddPost = () => {
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        user: { name: user.name, avatar: null },
        content: newPost,
        timestamp: 'Just now',
        likes: 0,
        comments: 0,
        isLiked: false
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '2rem',
      color: 'white'
    }}>
      {/* Create Post */}
      <div style={{
        background: '#2d3748',
        padding: '1.5rem',
        borderRadius: '0.5rem',
        marginBottom: '2rem'
      }}>
        <textarea
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
          placeholder="What's on your mind?"
          style={{
            width: '100%',
            minHeight: '80px',
            background: '#4a5568',
            border: 'none',
            borderRadius: '0.375rem',
            padding: '1rem',
            color: 'white',
            resize: 'vertical'
          }}
        />
        <button
          onClick={handleAddPost}
          style={{
            marginTop: '1rem',
            padding: '0.5rem 1.5rem',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}
        >
          Post
        </button>
      </div>

      {/* Posts Feed */}
      {posts.map(post => (
        <div key={post.id} style={{
          background: '#2d3748',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#6366f1',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '1rem',
              color: 'white',
              fontWeight: 'bold'
            }}>
              {post.user.name.charAt(0)}
            </div>
            <div>
              <div style={{ fontWeight: 'bold' }}>{post.user.name}</div>
              <div style={{ color: '#a0aec0', fontSize: '0.875rem' }}>{post.timestamp}</div>
            </div>
          </div>

          <p style={{ marginBottom: '1rem', lineHeight: '1.5' }}>{post.content}</p>

          <div style={{ display: 'flex', gap: '1rem', color: '#a0aec0' }}>
            <button
              onClick={() => handleLike(post.id)}
              style={{
                background: 'none',
                border: 'none',
                color: post.isLiked ? '#6366f1' : '#a0aec0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              ‚ù§Ô∏è {post.likes}
            </button>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#a0aec0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              Ì≤¨ {post.comments}
            </button>
            <button style={{
              background: 'none',
              border: 'none',
              color: '#a0aec0',
              cursor: 'pointer'
            }}>
              Ì¥Ñ Share
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Feed;
