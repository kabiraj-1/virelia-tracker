import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';
import goalService from '../../services/goalService';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    inProgressGoals: 0,
    overallProgress: 0
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const goalsData = await goalService.getGoals();
      setGoals(goalsData);
      
      // Calculate stats
      const totalGoals = goalsData.length;
      const completedGoals = goalsData.filter(goal => goal.isCompleted).length;
      const inProgressGoals = goalsData.filter(goal => !goal.isCompleted).length;
      const overallProgress = totalGoals > 0 
        ? Math.round(goalsData.reduce((sum, goal) => sum + goal.progress, 0) / totalGoals)
        : 0;

      setStats({
        totalGoals,
        completedGoals,
        inProgressGoals,
        overallProgress
      });
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{getGreeting()}, {user?.username}! Ì±ã</h1>
        <p>Here's your productivity overview for today</p>
      </div>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">ÌæØ</div>
          <h3>Total Goals</h3>
          <p className="stat-number">{stats.totalGoals}</p>
          <p className="stat-label">Goals set</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">Ì≥à</div>
          <h3>Progress</h3>
          <p className="stat-number">{stats.overallProgress}%</p>
          <p className="stat-label">Overall completion</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">‚úÖ</div>
          <h3>Completed</h3>
          <p className="stat-number">{stats.completedGoals}</p>
          <p className="stat-label">Goals achieved</p>
        </div>
        <div className="stat-card">
          <div className="stat-icon">Ì∫Ä</div>
          <h3>In Progress</h3>
          <p className="stat-number">{stats.inProgressGoals}</p>
          <p className="stat-label">Active goals</p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-goals">
          <div className="section-header">
            <h2>Recent Goals</h2>
            <Link to="/goals" className="view-all-link">View All ‚Üí</Link>
          </div>
          
          {goals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">ÌæØ</div>
              <h3>No goals yet</h3>
              <p>Start your productivity journey by creating your first goal!</p>
              <Link to="/goals" className="btn-primary">
                Create Your First Goal
              </Link>
            </div>
          ) : (
            <div className="goals-list">
              {goals.slice(0, 3).map(goal => (
                <div key={goal._id} className="goal-item">
                  <div className="goal-info">
                    <h4>{goal.title}</h4>
                    <p>{goal.description || 'No description'}</p>
                    <span className="goal-category">{goal.category}</span>
                  </div>
                  <div className="goal-progress">
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ width: `${goal.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{goal.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="action-cards">
            <Link to="/goals" className="action-card">
              <div className="action-icon">‚ûï</div>
              <h3>Add Goal</h3>
              <p>Create a new goal to track</p>
            </Link>
            <Link to="/activities" className="action-card">
              <div className="action-icon">‚è±Ô∏è</div>
              <h3>Log Activity</h3>
              <p>Record your daily activities</p>
            </Link>
            <Link to="/friends" className="action-card">
              <div className="action-icon">Ì±•</div>
              <h3>Find Friends</h3>
              <p>Connect with other users</p>
            </Link>
            <Link to="/analytics" className="action-card">
              <div className="action-icon">Ì≥ä</div>
              <h3>View Analytics</h3>
              <p>See your progress insights</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
