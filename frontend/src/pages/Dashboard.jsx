import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    console.log('Dashboard mounted - checking authentication...')
    
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    
    console.log('Token from storage:', token ? 'Present' : 'Missing')
    console.log('User data from storage:', userData ? 'Present' : 'Missing')
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        console.log('User authenticated:', parsedUser.email)
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        navigate('/login')
      }
    } else {
      console.log('No authentication found, redirecting to login...')
      navigate('/login')
    }
    
    setLoading(false)
  }, [navigate])

  const handleLogout = () => {
    console.log('Logging out...')
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  if (loading) {
    return (
      <div className="container">
        <div style={{ 
          textAlign: 'center', 
          padding: '4rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div>Checking authentication...</div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Authentication Required</h2>
          <p>Please log in to access the dashboard.</p>
          <Link to="/login" className="btn btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ 
        maxWidth: '800px', 
        margin: '2rem auto', 
        padding: '2rem', 
        background: 'white', 
        borderRadius: '1rem', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '2rem' 
        }}>
          <div>
            <h1>Welcome to Your Dashboard</h1>
            <p style={{ color: '#64748b', marginTop: '0.5rem' }}>
              Hello, {user.name || user.email}!
            </p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '1rem', 
          marginBottom: '2rem' 
        }}>
          <div style={{ 
            padding: '1.5rem', 
            background: '#f8fafc', 
            borderRadius: '0.5rem', 
            border: '1px solid #e2e8f0' 
          }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Profile</h3>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>Manage your account settings</p>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              Edit Profile
            </button>
          </div>
          
          <div style={{ 
            padding: '1.5rem', 
            background: '#f8fafc', 
            borderRadius: '0.5rem', 
            border: '1px solid #e2e8f0' 
          }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Friends</h3>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>Connect with other users</p>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              Find Friends
            </button>
          </div>
          
          <div style={{ 
            padding: '1.5rem', 
            background: '#f8fafc', 
            borderRadius: '0.5rem', 
            border: '1px solid #e2e8f0' 
          }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Posts</h3>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>Create and share content</p>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              New Post
            </button>
          </div>
        </div>

        <div style={{ 
          padding: '1.5rem', 
          background: '#f0fdf4', 
          borderRadius: '0.5rem', 
          border: '1px solid #bbf7d0' 
        }}>
          <h3 style={{ color: '#166534', marginBottom: '0.5rem' }}>Getting Started</h3>
          <p style={{ color: '#15803d' }}>
            Complete your profile, connect with friends, and start sharing your journey on Virelia!
          </p>
        </div>

        {/* Debug info */}
        <div style={{ 
          marginTop: '2rem', 
          padding: '1rem', 
          background: '#f1f5f9', 
          borderRadius: '0.5rem', 
          fontSize: '0.75rem',
          fontFamily: 'monospace'
        }}>
          <strong>Debug Info:</strong>
          <div>User: {user.email}</div>
          <div>Token: {localStorage.getItem('token') ? 'Present' : 'Missing'}</div>
          <div>User ID: {user.id}</div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
