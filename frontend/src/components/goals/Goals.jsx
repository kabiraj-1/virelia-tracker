import React, { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import './Goals.css';

const Goals = () => {
  const { user } = useContext(AuthContext);
  const [goals, setGoals] = useState([]);

  return (
    <div className="goals">
      <div className="goals-header">
        <h1>Goals í¾¯</h1>
        <p>Set and track your productivity goals</p>
        <button className="create-goal-btn">
          + Create New Goal
        </button>
      </div>

      <div className="goals-content">
        <div className="goals-list">
          <div className="empty-goals">
            <div className="empty-icon">í¾¯</div>
            <h3>No goals yet</h3>
            <p>Create your first goal to start tracking your progress. Goals help you stay focused and motivated.</p>
            <div className="goal-examples">
              <h4>Goal Ideas:</h4>
              <ul>
                <li>Complete 10 focus sessions this week</li>
                <li>Study for 2 hours daily</li>
                <li>Finish a project by Friday</li>
                <li>Read 30 minutes every day</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="goals-stats">
          <div className="stats-card">
            <h3>Goals Overview</h3>
            <div className="stat-item">
              <span>Active Goals:</span>
              <strong>0</strong>
            </div>
            <div className="stat-item">
              <span>Completed:</span>
              <strong>0</strong>
            </div>
            <div className="stat-item">
              <span>Success Rate:</span>
              <strong>0%</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goals;
