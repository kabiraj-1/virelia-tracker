import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ActivityDashboard = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('week');

  // Mock activity data
  const activityData = {
    week: {
      productivity: 85,
      goalsCompleted: 12,
      timeFocused: '28h 15m',
      sessions: 24,
      streak: 7
    },
    month: {
      productivity: 78,
      goalsCompleted: 42,
      timeFocused: '112h 30m',
      sessions: 96,
      streak: 28
    }
  };

  const recentActivities = [
    { id: 1, type: 'goal_completed', title: 'Completed Daily Reading', time: '2 hours ago', points: 10 },
    { id: 2, type: 'friend_joined', title: 'Alex joined your challenge', time: '4 hours ago', points: 5 },
    { id: 3, type: 'streak_milestone', title: '7-day streak achieved!', time: '1 day ago', points: 25 },
    { id: 4, type: 'goal_set', title: 'Set new fitness goal', time: '1 day ago', points: 5 }
  ];

  const goals = [
    { id: 1, title: 'Morning Meditation', completed: true, current: 7, target: 7 },
    { id: 2, title: 'Daily Exercise', completed: false, current: 4, target: 7 },
    { id: 3, title: 'Learn Spanish', completed: false, current: 25, target: 30 },
    { id: 4, title: 'Read Books', completed: false, current: 3, target: 5 }
  ];

  const currentData = activityData[timeRange];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem'
      }}>
        <h1 style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '2.5rem',
          margin: 0
        }}>
          Activity Dashboard
        </h1>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['week', 'month'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '0.5rem 1rem',
                background: timeRange === range ? '#6366f1' : '#4a5568',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              This {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Productivity Score */}
        <div style={{
          background: '#2d3748',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#48bb78' }}>
            {currentData.productivity}%
          </div>
          <div style={{ color: '#a0aec0' }}>Productivity Score</div>
          <div style={{
            width: '100%',
            height: '8px',
            background: '#4a5568',
            borderRadius: '4px',
            marginTop: '1rem',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${currentData.productivity}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #48bb78, #68d391)',
              borderRadius: '4px'
            }}></div>
          </div>
        </div>

        {/* Goals Completed */}
        <div style={{
          background: '#2d3748',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4299e1' }}>
            {currentData.goalsCompleted}
          </div>
          <div style={{ color: '#a0aec0' }}>Goals Completed</div>
        </div>

        {/* Time Focused */}
        <div style={{
          background: '#2d3748',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ed8936' }}>
            {currentData.timeFocused}
          </div>
          <div style={{ color: '#a0aec0' }}>Time Focused</div>
        </div>

        {/* Current Streak */}
        <div style={{
          background: '#2d3748',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#f56565' }}>
            {currentData.streak} days
          </div>
          <div style={{ color: '#a0aec0' }}>Current Streak</div>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '2rem'
      }}>
        {/* Recent Activities */}
        <div style={{
          background: '#2d3748',
          padding: '1.5rem',
          borderRadius: '0.5rem'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#a0aec0' }}>Recent Activities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivities.map(activity => (
              <div key={activity.id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                background: '#4a5568',
                borderRadius: '0.375rem'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#6366f1',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>
                  {activity.type === 'goal_completed' && 'ÌæØ'}
                  {activity.type === 'friend_joined' && 'Ì±•'}
                  {activity.type === 'streak_milestone' && 'Ì¥•'}
                  {activity.type === 'goal_set' && 'Ì≥ù'}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{activity.title}</div>
                  <div style={{ color: '#718096', fontSize: '0.875rem' }}>
                    {activity.time} ‚Ä¢ +{activity.points} points
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Goals */}
        <div style={{
          background: '#2d3748',
          padding: '1.5rem',
          borderRadius: '0.5rem'
        }}>
          <h3 style={{ marginBottom: '1rem', color: '#a0aec0' }}>Current Goals</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {goals.map(goal => (
              <div key={goal.id} style={{
                padding: '1rem',
                background: '#4a5568',
                borderRadius: '0.375rem'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.5rem'
                }}>
                  <span style={{ fontWeight: 'bold' }}>{goal.title}</span>
                  <span style={{
                    color: goal.completed ? '#48bb78' : '#a0aec0',
                    fontSize: '0.875rem'
                  }}>
                    {goal.current}/{goal.target}
                  </span>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: '#2d3748',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(goal.current / goal.target) * 100}%`,
                    height: '100%',
                    background: goal.completed ? '#48bb78' : '#6366f1',
                    borderRadius: '3px'
                  }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityDashboard;
