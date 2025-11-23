import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import goalService from '../../services/goalService';
import './Profile.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [goals, setGoals] = useState([]);
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    averageProgress: 0,
    streak: 0
  });
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    bio: '',
    website: '',
    location: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        website: user.website || '',
        location: user.location || ''
      });
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      const goalsData = await goalService.getGoals();
      setGoals(goalsData);
      
      const totalGoals = goalsData.length;
      const completedGoals = goalsData.filter(goal => goal.isCompleted).length;
      const averageProgress = totalGoals > 0 
        ? Math.round(goalsData.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals)
        : 0;

      setStats({
        totalGoals,
        completedGoals,
        averageProgress,
        streak: calculateStreak(goalsData)
      });
    } catch (error) {
      console.error('Error loading user stats:', error);
    }
  };

  const calculateStreak = (goalsData) => {
    // Simple streak calculation based on recent goal activity
    const recentActivities = goalsData
      .filter(goal => goal.updatedAt)
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 7);
    
    return recentActivities.length;
  };

  const handleSaveProfile = async () => {
    try {
      // Here you would typically make an API call to update the user profile
      // For now, we'll just update the local state
      updateUser({ ...user, ...formData });
      setEditMode(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
  };

  const getAchievementLevel = () => {
    const score = stats.completedGoals * 10 + stats.averageProgress;
    if (score >= 100) return { level: 'Master', color: '#FFD700', icon: 'ÌøÜ' };
    if (score >= 70) return { level: 'Expert', color: '#C0C0C0', icon: '‚≠ê' };
    if (score >= 40) return { level: 'Intermediate', color: '#CD7F32', icon: 'Ì¥•' };
    return { level: 'Beginner', color: '#667eea', icon: 'Ìº±' };
  };

  const achievement = getAchievementLevel();

  if (!user) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-placeholder">
            {user.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="achievement-badge" style={{ borderColor: achievement.color }}>
            {achievement.icon}
          </div>
        </div>
        
        <div className="profile-info">
          <div className="profile-main">
            {editMode ? (
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="edit-input large"
              />
            ) : (
              <h1>{user.username}</h1>
            )}
            <span className="achievement-level" style={{ color: achievement.color }}>
              {achievement.level} Achiever
            </span>
          </div>
          
          <div className="profile-stats">
            <div className="profile-stat">
              <span className="stat-number">{stats.totalGoals}</span>
              <span className="stat-label">Goals</span>
            </div>
            <div className="profile-stat">
              <span className="stat-number">{stats.completedGoals}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="profile-stat">
              <span className="stat-number">{stats.streak}</span>
              <span className="stat-label">Day Streak</span>
            </div>
            <div className="profile-stat">
              <span className="stat-number">{stats.averageProgress}%</span>
              <span className="stat-label">Avg Progress</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          {editMode ? (
            <>
              <button className="btn-primary" onClick={handleSaveProfile}>
                Save Changes
              </button>
              <button className="btn-secondary" onClick={() => setEditMode(false)}>
                Cancel
              </button>
            </>
          ) : (
            <button className="btn-primary" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          )}
        </div>
      </div>

      {/* Profile Navigation */}
      <div className="profile-nav">
        <button 
          className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Ì≥ä Overview
        </button>
        <button 
          className={`nav-item ${activeTab === 'goals' ? 'active' : ''}`}
          onClick={() => setActiveTab('goals')}
        >
          ÌæØ Goals
        </button>
        <button 
          className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ‚öôÔ∏è Settings
        </button>
        <button 
          className={`nav-item ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          ÌøÜ Achievements
        </button>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        {activeTab === 'overview' && (
          <div className="tab-content">
            <div className="overview-grid">
              <div className="overview-card">
                <h3>Ì≥à Progress Overview</h3>
                <div className="progress-circle">
                  <div className="circle-background"></div>
                  <div 
                    className="circle-progress"
                    style={{ transform: `rotate(${stats.averageProgress * 3.6}deg)` }}
                  ></div>
                  <div className="circle-text">
                    <span className="progress-percent">{stats.averageProgress}%</span>
                    <span className="progress-label">Overall</span>
                  </div>
                </div>
                <p>Your overall goal completion rate</p>
              </div>

              <div className="overview-card">
                <h3>Ì¥• Current Streak</h3>
                <div className="streak-display">
                  <span className="streak-number">{stats.streak}</span>
                  <span className="streak-label">days</span>
                </div>
                <p>Keep going to maintain your streak!</p>
              </div>

              <div className="overview-card">
                <h3>Ì≥ä Goal Distribution</h3>
                <div className="distribution">
                  <div className="dist-item">
                    <span className="dist-label">Completed</span>
                    <div className="dist-bar">
                      <div 
                        className="dist-fill completed"
                        style={{ width: `${stats.totalGoals ? (stats.completedGoals / stats.totalGoals) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="dist-count">{stats.completedGoals}</span>
                  </div>
                  <div className="dist-item">
                    <span className="dist-label">In Progress</span>
                    <div className="dist-bar">
                      <div 
                        className="dist-fill in-progress"
                        style={{ width: `${stats.totalGoals ? ((stats.totalGoals - stats.completedGoals) / stats.totalGoals) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="dist-count">{stats.totalGoals - stats.completedGoals}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="tab-content">
            <h3>Your Goals</h3>
            <div className="goals-grid">
              {goals.map(goal => (
                <div key={goal._id} className="goal-card">
                  <div className="goal-header">
                    <span className="goal-category">{goal.category}</span>
                    <span className={`goal-status ${goal.isCompleted ? 'completed' : 'in-progress'}`}>
                      {goal.isCompleted ? '‚úÖ Completed' : 'Ì¥Ñ In Progress'}
                    </span>
                  </div>
                  <h4>{goal.title}</h4>
                  <p>{goal.description}</p>
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <span>{goal.progress}%</span>
                  </div>
                  {goal.targetDate && (
                    <div className="goal-date">
                      Ì∑ìÔ∏è {new Date(goal.targetDate).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-content">
            <h3>Profile Settings</h3>
            <div className="settings-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!editMode}
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!editMode}
                />
              </div>
              
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  disabled={!editMode}
                  placeholder="Tell us about yourself..."
                  rows="3"
                />
              </div>
              
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  disabled={!editMode}
                  placeholder="Where are you from?"
                />
              </div>
              
              <div className="form-group">
                <label>Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  disabled={!editMode}
                  placeholder="https://yourwebsite.com"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="tab-content">
            <h3>Your Achievements</h3>
            <div className="achievements-grid">
              <div className="achievement-card unlocked">
                <div className="achievement-icon">ÌæØ</div>
                <div className="achievement-info">
                  <h4>Goal Setter</h4>
                  <p>Create your first goal</p>
                </div>
                <div className="achievement-badge">‚úÖ</div>
              </div>
              
              <div className="achievement-card unlocked">
                <div className="achievement-icon">‚úÖ</div>
                <div className="achievement-info">
                  <h4>First Completion</h4>
                  <p>Complete your first goal</p>
                </div>
                <div className="achievement-badge">‚úÖ</div>
              </div>
              
              <div className="achievement-card locked">
                <div className="achievement-icon">Ì¥•</div>
                <div className="achievement-info">
                  <h4>7-Day Streak</h4>
                  <p>Be active for 7 consecutive days</p>
                </div>
                <div className="achievement-badge">Ì¥í</div>
              </div>
              
              <div className="achievement-card locked">
                <div className="achievement-icon">ÌøÜ</div>
                <div className="achievement-info">
                  <h4>Goal Master</h4>
                  <p>Complete 10 goals</p>
                </div>
                <div className="achievement-badge">Ì¥í</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
