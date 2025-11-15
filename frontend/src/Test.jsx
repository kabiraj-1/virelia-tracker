import React from 'react';

const Test = () => {
  return (
    <div style={{ 
      padding: '20px', 
      background: 'green', 
      color: 'white',
      margin: '20px',
      borderRadius: '8px',
      textAlign: 'center'
    }}>
      <h2>✅ FRESH DEPLOYMENT VERIFIED</h2>
      <p>This content proves the deployment is fresh and working.</p>
      <p><strong>Build Timestamp:</strong> {new Date().toISOString()}</p>
      <p>If you see this, Vercel is deploying your current code correctly.</p>
    </div>
  );
};

export default Test;
