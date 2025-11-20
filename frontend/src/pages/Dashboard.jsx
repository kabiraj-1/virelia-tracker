import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import PostsFeed from '../components/PostsFeed'
import CreatePost from '../components/CreatePost'
import FriendsList from '../components/FriendsList'
import ChatInterface from '../components/ChatInterface'
import Notifications from '../components/Notifications'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('feed')
  const navigate = useNavigate()

  useEffect(() => {
    console.log('Dashboard mounted - checking authentication...')
    
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

  const handlePostCreated = () => {
    // Refresh posts feed if needed
    setActiveTab('feed')
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
          <div>Loading dashboard...</div>
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
          <button onClick={() => navigate('/login')} className="btn btn-primary">
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ 
        background: 'white', 
        borderRadius: '1rem', 
        padding: '2rem', 
        marginBottom: '1.5rem',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>Welcome to Virelia, {user.name || user.email}!</h1>
            <p style={{ color: '#64748b', margin: 0 }}>
              Connect, share, and grow with our community
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Notifications />
            <button onClick={() => navigate('/profile')} className="btn btn-secondary">
              Profile
            </button>
            <button onClick={handleLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'feed', label: 'í³ Feed' },
          { id: 'create', label: 'âœ¨ Create Post' },
          { id: 'friends', label: 'í±¥ Friends' },
          { id: 'chat', label: 'í²¬ Messages' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={activeTab === tab.id ? 'btn btn-primary' : 'btn btn-secondary'}
            style={{ 
              padding: '0.75rem 1.5rem',
              fontSize: '0.875rem',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div>
        {activeTab === 'feed' && (
          <div>
            <CreatePost onPostCreated={handlePostCreated} />
            <PostsFeed />
          </div>
        )}

        {activeTab === 'create' && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <CreatePost onPostCreated={handlePostCreated} />
          </div>
        )}

        {activeTab === 'friends' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <FriendsList />
          </div>
        )}

        {activeTab === 'chat' && (
          <ChatInterface />
        )}
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
        <div>Active Tab: {activeTab}</div>
      </div>
    </div>
  )
}

export default Dashboard
