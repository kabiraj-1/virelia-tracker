import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Analytics.css';

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const [timeRange, setTimeRange] = useState('week');

  return (
    <div className="analytics">
      <div className="analytics-header">
        <h1>Analytics í³ˆ</h1>
        <p>Track your productivity patterns and insights</p>
        
        <div className="time-filter">
          <button 
            className={timeRange === 'week' ? 'active' : ''}
            onClick={() => setTimeRange('week')}
          >
            Week
          </button>
          <button 
            className={timeRange === 'month' ? 'active' : ''}
            onClick={() => setTimeRange('month')}
          >
            Month
          </button>
          <button 
            className={timeRange === 'year' ? 'active' : ''}
            onClick={() => setTimeRange('year')}
          >
            Year
          </button>
        </div>
      </div>

      <div className="analytics-content">
        <div className="analytics-section">
          <h2>Productivity Overview</h2>
          <div className="empty-analytics">
            <div className="empty-icon">í³Š</div>
            <h3>No data yet</h3>
            <p>Start using the app to see your analytics here. Your productivity insights will appear once you begin tracking activities.</p>
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric-card">
            <h3>Average Daily Hours</h3>
            <div className="metric-value">0h</div>
            <p>Track activities to see your average</p>
          </div>

          <div className="metric-card">
            <h3>Focus Sessions</h3>
            <div className="metric-value">0</div>
            <p>Completed focus sessions will appear here</p>
          </div>

          <div className="metric-card">
            <h3>Productivity Score</h3>
            <div className="metric-value">0%</div>
            <p>Based on your goal completion rate</p>
          </div>

          <div className="metric-card">
            <h3>Consistency</h3>
            <div className="metric-value">0%</div>
            <p>Your daily tracking consistency</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
