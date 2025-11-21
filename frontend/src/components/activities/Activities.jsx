import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Activities.css';

const Activities = () => {
  const { user } = useContext(AuthContext);
  const [activities, setActivities] = useState([]);

  return (
    <div className="activities">
      <div className="activities-header">
        <h1>Activities Ì≥ù</h1>
        <p>Track your daily activities and productivity sessions</p>
        <button className="log-activity-btn">
          + Log Activity
        </button>
      </div>

      <div className="activities-content">
        <div className="recent-activities">
          <h2>Recent Activities</h2>
          <div className="empty-activities">
            <div className="empty-icon">‚è±Ô∏è</div>
            <h3>No activities logged</h3>
            <p>Start logging your activities to track your productivity. Each activity session helps build your productivity profile.</p>
            <div className="activity-types">
              <h4>Activity Types You Can Track:</h4>
              <ul>
                <li>Study sessions</li>
                <li>Work projects</li>
                <li>Reading time</li>
                <li>Exercise</li>
                <li>Creative work</li>
                <li>Skill development</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="activity-stats">
          <div className="stats-card">
            <h3>Today's Summary</h3>
            <div className="stat-item">
              <span>Total Time:</span>
              <strong>0h 0m</strong>
            </div>
            <div className="stat-item">
              <span>Sessions:</span>
              <strong>0</strong>
            </div>
            <div className="stat-item">
              <span>Focus Score:</span>
              <strong>0%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activities;
