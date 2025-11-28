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
      textAlign: 'center'
    }}>
      <div>
        <h1>Welcome to Virelia Dashboard</h1>
        <p>Your cosmic productivity journey begins here</p>
      </div>
    </div>
  );
};

export default Home;
