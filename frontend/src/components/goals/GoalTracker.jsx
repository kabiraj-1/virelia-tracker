import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const GoalTracker = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-goals');

  return (
    <div style={{
      maxWidth: '1000px',
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
          Goal Tracker
        </h1>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['my-goals', 'shared'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.75rem 1.5rem',
                background: activeTab === tab ? '#6366f1' : '#4a5568',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                textTransform: 'capitalize'
              }}
            >
              {tab.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'my-goals' && (
        <div style={{
          background: '#2d3748',
          padding: '2rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#a0aec0', marginBottom: '1rem' }}>My Goals</h3>
          <p style={{ color: '#718096' }}>Goal tracking feature coming soon!</p>
        </div>
      )}

      {activeTab === 'shared' && (
        <div style={{
          background: '#2d3748',
          padding: '2rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#a0aec0', marginBottom: '1rem' }}>Shared Goals</h3>
          <p style={{ color: '#718096' }}>Share and track goals with friends!</p>
        </div>
      )}
    </div>
  );
};

export default GoalTracker;
