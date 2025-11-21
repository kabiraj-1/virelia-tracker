import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const AdvancedAnalytics = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('month');

  // Mock analytics data
  const analyticsData = {
    month: {
      productivity: {
        score: 78,
        trend: 'up',
        change: 12,
        dailyAverage: '3h 45m',
        peakHours: ['09:00', '14:00', '19:00']
      },
      goals: {
        completed: 42,
        inProgress: 8,
        abandoned: 3,
        completionRate: 84,
        avgCompletionTime: '2.3 days'
      }
    },
    week: {
      productivity: {
        score: 85,
        trend: 'up',
        change: 5,
        dailyAverage: '4h 15m',
        peakHours: ['08:00', '13:00', '18:00']
      },
      goals: {
        completed: 12,
        inProgress: 5,
        abandoned: 1,
        completionRate: 92,
        avgCompletionTime: '1.8 days'
      }
    }
  };

  const currentData = analyticsData[timeRange];

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      color: 'white'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <h1 style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontSize: '2.5rem',
          margin: 0
        }}>
          Advanced Analytics
        </h1>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['week', 'month'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                padding: '0.75rem 1.5rem',
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

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Productivity */}
        <div style={{
          background: '#2d3748',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#48bb78' }}>
            {currentData.productivity.score}%
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
              width: `${currentData.productivity.score}%`,
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
            {currentData.goals.completed}
          </div>
          <div style={{ color: '#a0aec0' }}>Goals Completed</div>
        </div>

        {/* Completion Rate */}
        <div style={{
          background: '#2d3748',
          padding: '1.5rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ed8936' }}>
            {currentData.goals.completionRate}%
          </div>
          <div style={{ color: '#a0aec0' }}>Completion Rate</div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
