import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Communities = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('my-communities');

  return (
    <div style={{
      maxWidth: '1000px',
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
          Communities
        </h1>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['my-communities', 'discover'].map(tab => (
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

      {activeTab === 'my-communities' && (
        <div style={{
          background: '#2d3748',
          padding: '2rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#a0aec0', marginBottom: '1rem' }}>My Communities</h3>
          <p style={{ color: '#718096' }}>Join and manage your communities!</p>
        </div>
      )}

      {activeTab === 'discover' && (
        <div style={{
          background: '#2d3748',
          padding: '2rem',
          borderRadius: '0.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{ color: '#a0aec0', marginBottom: '1rem' }}>Discover Communities</h3>
          <p style={{ color: '#718096' }}>Find new communities to join!</p>
        </div>
      )}
    </div>
  );
};

export default Communities;
