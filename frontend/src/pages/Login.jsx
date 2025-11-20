import React, { useState } from 'react'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'https://virelia-tracker.onrender.com/api';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    console.log('Login attempt:', formData)
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()
      console.log('Login response:', data)
      
      if (response.ok && data.token) {
        // Save token and user data securely
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        
        console.log('Token saved:', data.token.substring(0, 20) + '...')
        console.log('User data saved:', data.user)
        
        // Show success message
        alert('Login successful! Redirecting to dashboard...')
        
        // Force reload to ensure auth state is updated
        window.location.href = '/dashboard'
        
      } else {
        setError(data.message || 'Login failed. Please check your credentials.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    if (error) setError('')
  }

  return (
    <div className="container">
      <div className="form-container">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login to Virelia</h2>
        
        {error && (
          <div style={{
            padding: '1rem',
            background: '#fee2e2',
            border: '1px solid #fecaca',
            borderRadius: '0.5rem',
            marginBottom: '1rem',
            color: '#dc2626'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
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
              placeholder="Enter your email"
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
              placeholder="Enter your password"
            />
          </div>
          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', marginBottom: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p style={{ marginBottom: '0.5rem' }}>
            Don't have an account? <Link to="/register">Sign up here</Link>
          </p>
          <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
            Connect, share, and grow with our community
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
