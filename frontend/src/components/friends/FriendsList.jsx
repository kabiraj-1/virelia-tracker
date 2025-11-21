import React, { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'https://virelia-tracker.onrender.com/api';

const FriendsList = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [friendRequests, setFriendRequests] = useState([])

  useEffect(() => {
    fetchUsers()
    fetchFriendRequests()
  }, [])

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      
      if (data.success) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFriendRequests = async () => {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const user = JSON.parse(userData)
        setFriendRequests(user.friendRequests || [])
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error)
    }
  }

  const sendFriendRequest = async (toUserId) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/friends/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ toUserId })
      })

      const data = await response.json()
      
      if (data.success) {
        alert('Friend request sent!')
        // Update UI
        setUsers(prev => prev.map(user => 
          user.id === toUserId || user._id === toUserId
            ? { ...user, hasSentRequest: true }
            : user
        ))
      } else {
        alert('Error: ' + data.message)
      }
    } catch (error) {
      console.error('Error sending friend request:', error)
      alert('Error sending friend request')
    }
  }

  const handleFriendRequestResponse = async (requestId, accept) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/friends/respond`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ requestId, accept })
      })

      const data = await response.json()
      
      if (data.success) {
        alert(`Friend request ${accept ? 'accepted' : 'rejected'}!`)
        // Remove from local state
        setFriendRequests(prev => prev.filter(req => req.id !== requestId && req._id !== requestId))
      }
    } catch (error) {
      console.error('Error responding to friend request:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}')
    const isCurrentUser = user.id === currentUser.id || user._id === currentUser.id
    return !isCurrentUser && (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <div>Loading users...</div>
      </div>
    )
  }

  return (
    <div style={{
      background: 'white',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0'
    }}>
      <h3 style={{ marginBottom: '1rem' }}>Find Friends</h3>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #d1d5db',
            borderRadius: '0.5rem',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* Friend Requests */}
      {friendRequests.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ marginBottom: '0.5rem' }}>Friend Requests</h4>
          {friendRequests.map(request => (
            <div key={request.id || request._id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              background: '#f8fafc',
              borderRadius: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <span>Request from user ID: {request.from}</span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => handleFriendRequestResponse(request.id || request._id, true)}
                  className="btn btn-primary"
                  style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                >
                  Accept
                </button>
                <button 
                  onClick={() => handleFriendRequestResponse(request.id || request._id, false)}
                  className="btn btn-secondary"
                  style={{ fontSize: '0.875rem', padding: '0.25rem 0.5rem' }}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users List */}
      <div>
        <h4 style={{ marginBottom: '0.5rem' }}>Users</h4>
        {filteredUsers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '1rem', color: '#64748b' }}>
            {searchTerm ? 'No users found' : 'No users available'}
          </div>
        ) : (
          filteredUsers.map(user => (
            <div key={user.id || user._id} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.75rem',
              borderBottom: '1px solid #f1f5f9'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                  fontSize: '0.875rem'
                }}>
                  {user.name?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>{user.name || 'Unknown User'}</div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>{user.email}</div>
                  {user.online && (
                    <div style={{ fontSize: '0.75rem', color: '#10b981' }}>● Online</div>
                  )}
                </div>
              </div>
              
              <button 
                onClick={() => sendFriendRequest(user.id || user._id)}
                disabled={user.hasSentRequest}
                className={user.hasSentRequest ? 'btn btn-secondary' : 'btn btn-primary'}
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
              >
                {user.hasSentRequest ? 'Request Sent' : 'Add Friend'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default FriendsList
