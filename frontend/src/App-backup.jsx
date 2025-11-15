import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Import social components
import { SocialProvider } from './contexts/SocialContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/shared/UI/Header';
import EventsPage from './pages/social/Events';
import FeedPage from './pages/social/Feed';
import KarmaLeaderboard from './components/social/Karma/KarmaLeaderboard';

function App() {
  const [backendStatus, setBackendStatus] = useState('connected');
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('feed');

  const API_BASE_URL = 'https://virelia-tracker.onrender.com/api';

  // Demo data for social features
  const demoFeed = [
    {
      id: 1,
      user: { name: 'John Doe', avatar: '👤', karmaPoints: 150 },
      content: 'Just completed the beach cleanup event! Amazing experience and earned 25 karma points! 🌊♻️',
      timestamp: '2 hours ago',
      likes: 15,
      comments: 3,
      karmaEarned: 25
    },
    {
      id: 2,
      user: { name: 'Sarah Smith', avatar: '👩', karmaPoints: 120 },
      content: 'Earned 50 karma points today for organizing the charity run! 🎉 Ready for the next community event!',
      timestamp: '5 hours ago',
      likes: 28,
      comments: 7,
      karmaEarned: 50
    },
    {
      id: 3,
      user: { name: 'Mike Johnson', avatar: '👨', karmaPoints: 95 },
      content: 'Just joined Virelia! Excited to participate in community events and build my karma. Any recommendations for beginners? 🤔',
      timestamp: '1 day ago',
      likes: 42,
      comments: 12,
      karmaEarned: 10
    }
  ];

  const demoEvents = [
    { 
      id: 1, 
      title: 'Beach Cleanup Drive', 
      date: '2025-11-15', 
      time: '10:00 AM',
      location: 'Sunset Beach',
      participants: 23, 
      maxParticipants: 50,
      karma: 25,
      description: 'Join us for a community beach cleanup to protect our oceans and marine life.',
      status: 'upcoming'
    },
    { 
      id: 2, 
      title: 'Charity Run for Education', 
      date: '2025-11-20', 
      time: '7:00 AM',
      location: 'Central Park',
      participants: 45, 
      maxParticipants: 100,
      karma: 30,
      description: '5K run to raise funds for underprivileged children education.',
      status: 'upcoming'
    },
    { 
      id: 3, 
      title: 'Food Distribution Volunteer', 
      date: '2025-11-18', 
      time: '2:00 PM',
      location: 'Community Center',
      participants: 15, 
      maxParticipants: 30,
      karma: 20,
      description: 'Help distribute food to families in need in our community.',
      status: 'upcoming'
    }
  ];

  const demoLeaderboard = [
    { id: 1, username: 'John Doe', karmaPoints: 150, avatar: '👑' },
    { id: 2, username: 'Sarah Smith', karmaPoints: 120, avatar: '⭐' },
    { id: 3, username: 'Mike Johnson', karmaPoints: 95, avatar: '🔥' },
    { id: 4, username: 'Emma Wilson', karmaPoints: 85, avatar: '🚀' },
    { id: 5, username: 'Alex Chen', karmaPoints: 75, avatar: '💫' }
  ];

  // Auto-check if user is logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing saved user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // AUTH MODAL COMPONENT
  const AuthModal = ({ type, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
      name: '',
      email: '',
      password: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        const mockUser = {
          id: 1,
          name: formData.name || 'Demo User',
          email: formData.email,
          karmaPoints: Math.floor(Math.random() * 100) + 10
        };
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        onSuccess();
        alert(`Welcome to Virelia, ${mockUser.name}! 🎉`);
      }, 1000);
    };

    return (
      <div className="modal-overlay">
        <div className="modal">
          <h2>{type === 'register' ? 'Join Virelia Community' : 'Welcome Back!'}</h2>
          <form onSubmit={handleSubmit}>
            {type === 'register' && (
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
                disabled={loading}
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
              disabled={loading}
            />
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              disabled={loading}
            />
            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? '🔄 Processing...' : (type === 'register' ? '🌟 Join Community' : '🔑 Login')}
            </button>
          </form>
          <button onClick={onClose} className="close-btn" disabled={loading}>
            Close
          </button>
        </div>
      </div>
    );
  };

  // MAIN SOCIAL PLATFORM INTERFACE
  return (
    <div className="App">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <h1>🌱 Virelia</h1>
            <p className="tagline">Social Events • Karma Rewards • Community Impact</p>
          </div>
          <nav className="nav-tabs">
            <button 
              className={activeTab === 'feed' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActiveTab('feed')}
            >
              📝 Community Feed
            </button>
            <button 
              className={activeTab === 'events' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActiveTab('events')}
            >
              🎯 Events
            </button>
            <button 
              className={activeTab === 'leaderboard' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActiveTab('leaderboard')}
            >
              🏆 Leaderboard
            </button>
            <button 
              className={activeTab === 'profile' ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActiveTab('profile')}
            >
              👤 Profile
            </button>
          </nav>
          <div className="user-menu">
            {user ? (
              <div className="user-info">
                <span className="welcome-text">Hello, {user.name}</span>
                <span className="karma-badge">⭐ {user.karmaPoints} karma</span>
                <span className="status-indicator">🟢 Online</span>
              </div>
            ) : (
              <div className="auth-buttons">
                <button 
                  onClick={() => setActiveTab('login')}
                  className="login-btn"
                >
                  🔑 Login
                </button>
                <button 
                  onClick={() => setActiveTab('register')}
                  className="signup-btn"
                >
                  🌟 Join Free
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <div className="feed-tab">
            {user ? (
              <div className="create-post">
                <div className="post-editor">
                  <div className="user-avatar-small">👤</div>
                  <textarea placeholder="Share your community experience, event updates, or ask a question..."></textarea>
                </div>
                <div className="post-actions">
                  <button className="add-image-btn">🖼️ Add Image</button>
                  <button className="add-event-btn">🎯 Tag Event</button>
                  <button className="post-btn">✨ Post to Community</button>
                </div>
              </div>
            ) : (
              <div className="auth-prompt">
                <h3>Join the Conversation! 🗣️</h3>
                <p>Login to share your experiences and connect with the community</p>
                <button onClick={() => setActiveTab('login')} className="auth-prompt-btn">
                  🔑 Login to Post
                </button>
              </div>
            )}
            
            <div className="feed">
              {demoFeed.map(post => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="user-info">
                      <span className="user-avatar">{post.user.avatar}</span>
                      <div className="user-details">
                        <strong>{post.user.name}</strong>
                        <div className="user-stats">
                          <span className="user-karma">⭐ {post.user.karmaPoints} karma</span>
                          <span className="post-time">{post.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <span className="karma-earned">+{post.karmaEarned} karma</span>
                  </div>
                  <p className="post-content">{post.content}</p>
                  <div className="post-engagement">
                    <button className="engagement-btn">❤️ {post.likes}</button>
                    <button className="engagement-btn">💬 {post.comments} comments</button>
                    <button className="engagement-btn">🔄 Share</button>
                    <button className="engagement-btn">⭐ Give Karma</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* EVENTS TAB */}
        {activeTab === 'events' && (
          <div className="events-tab">
            <div className="events-header">
              <div className="events-info">
                <h2>🎯 Community Events</h2>
                <p>Join events, earn karma, and make an impact!</p>
              </div>
              {user && (
                <button className="create-event-btn">
                  ➕ Create New Event
                </button>
              )}
            </div>
            
            <div className="events-stats">
              <div className="stat-card">
                <span className="stat-number">{demoEvents.length}</span>
                <span className="stat-label">Active Events</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{demoEvents.reduce((sum, event) => sum + event.participants, 0)}</span>
                <span className="stat-label">Total Participants</span>
              </div>
              <div className="stat-card">
                <span className="stat-number">{demoEvents.reduce((sum, event) => sum + event.karma, 0)}</span>
                <span className="stat-label">Karma Available</span>
              </div>
            </div>

            <div className="events-grid">
              {demoEvents.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-header">
                    <h3>{event.title}</h3>
                    <span className={`event-status ${event.status}`}>{event.status}</span>
                  </div>
                  <p className="event-description">{event.description}</p>
                  <div className="event-details">
                    <div className="detail-item">
                      <span className="detail-icon">📅</span>
                      <span>{event.date} at {event.time}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">📍</span>
                      <span>{event.location}</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">👥</span>
                      <span>{event.participants}/{event.maxParticipants} participants</span>
                    </div>
                    <div className="detail-item">
                      <span className="detail-icon">⭐</span>
                      <span className="karma-reward">{event.karma} karma points</span>
                    </div>
                  </div>
                  <div className="event-actions">
                    <button className="join-btn">
                      {user ? '🎯 Join Event' : '🔑 Login to Join'}
                    </button>
                    <button className="details-btn">ℹ️ Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LEADERBOARD TAB */}
        {activeTab === 'leaderboard' && (
          <div className="leaderboard-tab">
            <div className="leaderboard-header">
              <h2>🏆 Community Leaderboard</h2>
              <p>Top contributors making a difference in our community</p>
            </div>
            
            <div className="leaderboard-container">
              <div className="leaderboard-card">
                <div className="leaderboard-top3">
                  {demoLeaderboard.slice(0, 3).map((user, index) => (
                    <div key={user.id} className={`top-user rank-${index + 1}`}>
                      <div className="rank-medal">
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </div>
                      <div className="user-avatar-large">{user.avatar}</div>
                      <div className="user-info">
                        <h4>{user.username}</h4>
                        <p className="user-points">{user.karmaPoints} karma points</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="leaderboard-list">
                  <h4>Community Rankings</h4>
                  {demoLeaderboard.slice(3).map((user, index) => (
                    <div key={user.id} className="leaderboard-item">
                      <span className="rank">#{index + 4}</span>
                      <span className="user-avatar-small">{user.avatar}</span>
                      <span className="name">{user.username}</span>
                      <span className="points">{user.karmaPoints} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="profile-tab">
            {user ? (
              <div className="profile-card">
                <div className="profile-header">
                  <div className="avatar-section">
                    <div className="avatar-large">👤</div>
                    <div className="online-status">🟢 Online</div>
                  </div>
                  <div className="profile-info">
                    <h2>{user.name}</h2>
                    <p className="user-email">{user.email}</p>
                    <div className="karma-display">
                      <span className="karma-score">⭐ {user.karmaPoints} Karma Points</span>
                      <span className="level-badge">Level {Math.floor(user.karmaPoints / 100) + 1} Contributor</span>
                    </div>
                  </div>
                </div>
                
                <div className="profile-stats">
                  <div className="stat">
                    <strong>{user.karmaPoints}</strong>
                    <span>Total Karma</span>
                  </div>
                  <div className="stat">
                    <strong>12</strong>
                    <span>Events Joined</span>
                  </div>
                  <div className="stat">
                    <strong>5</strong>
                    <span>Events Created</span>
                  </div>
                  <div className="stat">
                    <strong>8</strong>
                    <span>Posts Shared</span>
                  </div>
                </div>
                
                <div className="recent-activity">
                  <h3>Recent Activity</h3>
                  <div className="activity-list">
                    <div className="activity-item">
                      <span className="activity-icon">🎯</span>
                      <span>Joined "Beach Cleanup Drive"</span>
                      <span className="activity-karma">+25 karma</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">📝</span>
                      <span>Posted about community experience</span>
                      <span className="activity-karma">+10 karma</span>
                    </div>
                    <div className="activity-item">
                      <span className="activity-icon">⭐</span>
                      <span>Received karma from Sarah Smith</span>
                      <span className="activity-karma">+5 karma</span>
                    </div>
                  </div>
                </div>
                
                <div className="profile-actions">
                  <button className="edit-profile-btn">✏️ Edit Profile</button>
                  <button 
                    onClick={() => {
                      setUser(null);
                      localStorage.clear();
                      setActiveTab('feed');
                    }} 
                    className="logout-btn"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-placeholder">
                <div className="placeholder-content">
                  <div className="placeholder-icon">👤</div>
                  <h3>Your Profile Awaits! 🌟</h3>
                  <p>Join our community to track your karma, participate in events, and make an impact!</p>
                  <div className="auth-prompts">
                    <button onClick={() => setActiveTab('login')} className="auth-prompt-btn">
                      🔑 Login to View Profile
                    </button>
                    <button onClick={() => setActiveTab('register')} className="auth-prompt-btn secondary">
                      🌟 Create Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* AUTH MODALS */}
        {activeTab === 'register' && (
          <AuthModal 
            type="register" 
            onClose={() => setActiveTab('feed')}
            onSuccess={() => setActiveTab('profile')}
          />
        )}
        {activeTab === 'login' && (
          <AuthModal 
            type="login" 
            onClose={() => setActiveTab('feed')}
            onSuccess={() => setActiveTab('profile')}
          />
        )}
      </main>

      {/* Backend Status Indicator */}
      <div className="backend-status-indicator">
        <span className={`status-dot ${backendStatus === 'connected' ? 'connected' : 'disconnected'}`}></span>
        Backend: {backendStatus === 'connected' ? 'Connected ✅' : 'Checking...'}
      </div>
    </div>
  );
}

export default App;