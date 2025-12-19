import React from 'react';

const Home = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a2e 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '2rem'
    }}>
      <div>
        <h1 style={{ 
          background: 'linear-gradient(45deg, #00f5ff, #9d4edd)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          Virelia Dashboard
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.2rem' }}>
          Your cosmic productivity journey begins here
        </p>
      </div>
    </div>
  );
};

export default Home;
