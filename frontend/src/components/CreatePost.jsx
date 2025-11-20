import React, { useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://virelia-tracker.onrender.com/api';

const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      alert('Please write something to post!')
      return
    }

    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content, image })
      })

      const data = await response.json()

      if (data.success) {
        setContent('')
        setImage('')
        if (onPostCreated) {
          onPostCreated(data.post)
        }
        alert('Post created successfully!')
      } else {
        alert('Error creating post: ' + data.message)
      }
    } catch (error) {
      console.error('Error creating post:', error)
      alert('Error creating post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      marginBottom: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>Create a Post</h3>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            style={{
              width: '100%',
              minHeight: '100px',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem',
              resize: 'vertical'
            }}
            disabled={loading}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL (optional)"
            style={{
              width: '100%',
              padding: '0.75rem',
              border: '1px solid #d1d5db',
              borderRadius: '0.5rem',
              fontSize: '1rem'
            }}
            disabled={loading}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading || !content.trim()}
          className="btn btn-primary"
          style={{ width: '100%' }}
        >
          {loading ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  )
}

export default CreatePost
