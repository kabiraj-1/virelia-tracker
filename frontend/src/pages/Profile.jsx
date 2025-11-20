import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL || 'https://virelia-tracker.onrender.com/api';

const Profile = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    website: '',
    location: ''
  })
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData({
        name: parsedUser.name || '',
        bio: parsedUser.bio || '',
        website: parsedUser.website || '',
        location: parsedUser.location || ''
      })
    } else {
      navigate('/login')
    }
    setLoading(false)
  }, [navigate])

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const updatedUser = { ...user, ...formData }
        setUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        setEditing(false)
        alert('Profile updated successfully!')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Error updating profile')
    }
  }

  if (loading) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div>Loading profile...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div style={{ 
        maxWidth: '600px', 
        margin: '2rem auto', 
        padding: '2rem', 
        background: 'white', 
        borderRadius: '1rem', 
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Your Profile</h1>
          <button 
            onClick={() => setEditing(!editing)} 
            className={editing ? 'btn btn-secondary' : 'btn btn-primary'}
          >
            {editing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            background: '#6366f1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '2rem',
            fontWeight: 'bold'
          }}>
            {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ marginBottom: '0.5rem' }}>{user?.name || 'User'}</h2>
            <p style={{ color: '#64748b' }}>{user?.email}</p>
            <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
              Member since {new Date(user?.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {editing ? (
          <div>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="Enter your name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Tell us about yourself"
                rows="3"
              />
            </div>
            <div className="form-group">
              <label htmlFor="website">Website</label>
              <input
                type="url"
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
                placeholder="https://example.com"
              />
            </div>
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="Your city or country"
              />
            </div>
            <button onClick={handleSaveProfile} className="btn btn-primary">
              Save Changes
            </button>
          </div>
        ) : (
          <div>
            {formData.bio && (
              <div style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>Bio</h3>
                <p style={{ color: '#64748b' }}>{formData.bio}</p>
              </div>
            )}
            {(formData.website || formData.location) && (
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                {formData.website && (
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>Website</h4>
                    <a href={formData.website} target="_blank" rel="noopener noreferrer" style={{ color: '#6366f1' }}>
                      {formData.website}
                    </a>
                  </div>
                )}
                {formData.location && (
                  <div>
                    <h4 style={{ marginBottom: '0.25rem' }}>Location</h4>
                    <p style={{ color: '#64748b' }}>{formData.location}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
