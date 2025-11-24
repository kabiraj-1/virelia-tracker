import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    currentStreak: 0,
    averageProgress: 0
  });

  useEffect(() => {
    // Fetch user stats would go here
    setStats({
      totalGoals: 1,
      completedGoals: 0,
      currentStreak: 1,
      averageProgress: 0
    });
  }, []);

  const handleNavigateToPosts = () => {
    navigate('/feed');
  };

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <div className="profile-avatar">
            {user?.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="profile-details">
            <h1>{user?.username || 'User'}</h1>
            <p className="profile-title">Beginner Achiever</p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{stats.totalGoals}</span>
                <span className="stat-label">Goals</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.completedGoals}</span>
                <span className="stat-label">Completed</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.currentStreak}</span>
                <span className="stat-label">Day Streak</span>
              </div>
              <div className="stat">
                <span className="stat-number">{stats.averageProgress}%</span>
                <span className="stat-label">Avg Progress</span>
              </div>
            </div>
          </div>
        </div>
        <button className="edit-profile-btn">
          Edit Profile
        </button>
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
        <button
          className={`nav-item posts-nav-item`}
          onClick={handleNavigateToPosts}
        >
          Ì≥± Posts
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
                <p className="progress-description">Your overall goal completion rate</p>
              </div>

              <div className="overview-card">
                <h3>Ì¥• Current Streak</h3>
                <div className="streak-display">
                  <span className="streak-number">{stats.currentStreak}</span>
                  <span className="streak-label">days</span>
                </div>
                <p className="streak-description">Keep going to maintain your streak!</p>
              </div>

              <div className="overview-card">
                <h3>ÌæØ Goal Distribution</h3>
                <div className="goal-distribution">
                  <div className="distribution-item">
                    <span className="distribution-label">Completed</span>
                    <span className="distribution-count">{stats.completedGoals}</span>
                  </div>
                  <div className="distribution-item">
                    <span className="distribution-label">In Progress</span>
                    <span className="distribution-count">{stats.totalGoals - stats.completedGoals}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'goals' && (
          <div className="tab-content">
            <h3>Your Goals</h3>
            <p>Goal management will be available here soon.</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="tab-content">
            <h3>Settings</h3>
            <p>Profile settings will be available here soon.</p>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="tab-content">
            <h3>Achievements</h3>
            <p>Your achievements will be displayed here soon.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
