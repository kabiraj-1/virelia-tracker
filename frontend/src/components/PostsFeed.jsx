import React, { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

const API_URL = import.meta.env.VITE_API_URL || 'https://virelia-tracker.onrender.com/api';

const PostsFeed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    // Connect to WebSocket
    const newSocket = io('https://virelia-tracker.onrender.com')
    setSocket(newSocket)

    // Listen for new posts
    newSocket.on('new_post', (post) => {
      setPosts(prev => [post, ...prev])
    })

    // Fetch initial posts
    fetchPosts()

    return () => newSocket.close()
  }, [])

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`)
      const data = await response.json()
      
      if (data.success) {
        setPosts(data.posts)
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()
      if (data.success) {
        // Update local state
        setPosts(prev => prev.map(post => 
          post.id === postId || post._id === postId 
            ? { ...post, likes: data.likes } 
            : post
        ))
      }
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading posts...</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>
          <h3>No posts yet</h3>
          <p>Be the first to share something!</p>
        </div>
      ) : (
        posts.map(post => (
          <div key={post.id || post._id} style={{
            background: 'white',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            marginBottom: '1rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0'
          }}>
            {/* Post Header */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: '#6366f1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                marginRight: '0.75rem'
              }}>
                {post.author?.name?.charAt(0) || 'U'}
              </div>
              <div>
                <div style={{ fontWeight: '600' }}>{post.author?.name || 'Unknown User'}</div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  {new Date(post.createdAt).toLocaleDateString()} at {new Date(post.createdAt).toLocaleTimeString()}
                </div>
              </div>
            </div>

            {/* Post Content */}
            <div style={{ marginBottom: '1rem', lineHeight: '1.6' }}>
              {post.content}
            </div>

            {post.image && (
              <div style={{ marginBottom: '1rem' }}>
                <img 
                  src={post.image} 
                  alt="Post" 
                  style={{ 
                    maxWidth: '100%', 
                    borderRadius: '0.5rem',
                    maxHeight: '400px',
                    objectFit: 'cover'
                  }} 
                />
              </div>
            )}

            {/* Post Actions */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid #e2e8f0'
            }}>
              <button 
                onClick={() => handleLike(post.id || post._id)}
                style={{ 
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                ‚ù§Ô∏è {post.likes?.length || 0} Likes
              </button>
              
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                color: '#64748b'
              }}>
                Ì≤¨ {post.comments?.length || 0} Comments
              </div>
            </div>

            {/* Comments Section */}
            {post.comments && post.comments.length > 0 && (
              <div style={{ 
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid #f1f5f9'
              }}>
                <h4 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>Comments:</h4>
                {post.comments.map((comment, index) => (
                  <div key={index} style={{ 
                    padding: '0.5rem 0',
                    borderBottom: '1px solid #f8fafc'
                  }}>
                    <div style={{ fontWeight: '600', fontSize: '0.875rem' }}>
                      {comment.author?.name || 'Unknown'}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#475569' }}>
                      {comment.content}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}

export default PostsFeed
