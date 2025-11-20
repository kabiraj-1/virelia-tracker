import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    console.log('Registration attempt:', formData)
    
    try {
      // Try multiple backend endpoints
      const backendUrls = [
        'https://virelia-tracker.onrender.com/api/auth/register',
        'https://virelia-tracker.onrender.com/auth/register',
        'https://virelia-tracker-backend.onrender.com/api/auth/register'
      ]

      let response = null
      let lastError = null

      for (const url of backendUrls) {
        try {
          console.log('Trying endpoint:', url)
          response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
          })
          
          if (response.ok) break
        } catch (error) {
          console.log('Endpoint failed:', url, error)
          lastError = error
          continue
        }
      }

      if (!response) {
        throw new Error('All backend endpoints failed')
      }

      const data = await response.json()
      console.log('Registration response:', data)
      
      if (response.ok) {
        alert('Registration successful! Please login.')
        window.location.href = '/login'
      } else {
        alert('Registration failed: ' + (data.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Registration error:', error)
      alert('Registration failed: Network error - Backend might be restarting. Please try again in a moment.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Join Virelia</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginBottom: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
        
        {/* Debug info */}
        <div style={{ marginTop: '2rem', padding: '1rem', background: '#f1f5f9', borderRadius: '0.5rem', fontSize: '0.875rem' }}>
          <strong>Debug Info:</strong>
          <div>Backend: virelia-tracker.onrender.com</div>
          <div>Status: {loading ? 'Connecting...' : 'Ready'}</div>
        </div>
      </div>
    </div>
  )
}

export default Register
