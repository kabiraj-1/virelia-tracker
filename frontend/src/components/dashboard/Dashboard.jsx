import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState({
    totalActivities: 0,
    friendsCount: 0,
    goalsCompleted: 0,
    weeklyProgress: 0
  });

  useEffect(() => {
    // TODO: Fetch real user stats from API
    // This will be populated with real data when backend endpoints are ready
  }, []);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name || 'User'}! í±‹</h1>
        <p>Track your productivity and achieve your goals</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">í³Š</div>
          <div className="stat-info">
            <h3>{stats.totalActivities}</h3>
            <p>Total Activities</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">í±¥</div>
          <div className="stat-info">
            <h3>{stats.friendsCount}</h3>
            <p>Friends</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">í¾¯</div>
          <div className="stat-info">
            <h3>{stats.goalsCompleted}</h3>
            <p>Goals Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">í³ˆ</div>
          <div className="stat-info">
            <h3>{stats.weeklyProgress}%</h3>
            <p>Weekly Progress</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="content-section">
          <h2>Your Recent Activity</h2>
          <div className="empty-state">
            <p>No activities yet. Start tracking to see your progress here!</p>
          </div>
        </div>

        <div className="content-section">
          <h2>Current Goals</h2>
          <div className="empty-state">
            <p>No active goals. Create your first goal to get started!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
