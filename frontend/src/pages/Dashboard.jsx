import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      // Redirect to login if not authenticated
      window.location.href = '/login'
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  if (!user) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Welcome to Your Dashboard</h1>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
        
        <div style={{ marginBottom: '2rem' }}>
          <h2>Hello, {user.name || user.email}!</h2>
          <p style={{ color: '#64748b' }}>Welcome to Virelia Social Platform</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Profile</h3>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>Manage your account settings</p>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              Edit Profile
            </button>
          </div>
          
          <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Friends</h3>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>Connect with other users</p>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              Find Friends
            </button>
          </div>
          
          <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Posts</h3>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>Create and share content</p>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              New Post
            </button>
          </div>
        </div>

        <div style={{ padding: '1.5rem', background: '#f0fdf4', borderRadius: '0.5rem', border: '1px solid #bbf7d0' }}>
          <h3 style={{ color: '#166534', marginBottom: '0.5rem' }}>Getting Started</h3>
          <p style={{ color: '#15803d' }}>
            Complete your profile, connect with friends, and start sharing your journey on Virelia!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
