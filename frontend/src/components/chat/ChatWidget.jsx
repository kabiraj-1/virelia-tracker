import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          width: '60px',
          height: '60px',
          background: '#6366f1',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          cursor: 'pointer',
          fontSize: '1.5rem',
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          zIndex: 1000
        }}
      >
        í²¬
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: '5rem',
          right: '2rem',
          width: '350px',
          height: '500px',
          background: '#2d3748',
          border: '1px solid #4a5568',
          borderRadius: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)'
        }}>
          {/* Chat Header */}
          <div style={{
            padding: '1rem',
            background: '#1a202c',
            borderBottom: '1px solid #4a5568',
            borderRadius: '0.5rem 0.5rem 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, color: 'white' }}>Community Chat</h3>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#a0aec0',
                cursor: 'pointer',
                fontSize: '1.2rem'
              }}
            >
              Ã—
            </button>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1,
            padding: '1rem',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            color: 'white'
          }}>
            <div style={{ textAlign: 'center', color: '#a0aec0' }}>
              Chat feature coming soon!
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
