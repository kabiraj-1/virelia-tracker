import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const ChatWidget = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, user: 'Alex', text: 'Hey! How are your goals going?', time: '2:30 PM' },
    { id: 2, user: 'You', text: 'Going great! Just completed my daily target í¾¯', time: '2:31 PM' },
    { id: 3, user: 'Sarah', text: 'Anyone want to join the productivity challenge?', time: '2:35 PM' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        user: 'You',
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

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
            gap: '1rem'
          }}>
            {messages.map(message => (
              <div
                key={message.id}
                style={{
                  alignSelf: message.user === 'You' ? 'flex-end' : 'flex-start',
                  background: message.user === 'You' ? '#6366f1' : '#4a5568',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  maxWidth: '80%',
                  wordWrap: 'break-word'
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                  {message.user}
                </div>
                <div style={{ margin: '0.25rem 0' }}>{message.text}</div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  opacity: 0.7,
                  textAlign: message.user === 'You' ? 'right' : 'left'
                }}>
                  {message.time}
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div style={{
            padding: '1rem',
            borderTop: '1px solid #4a5568',
            display: 'flex',
            gap: '0.5rem'
          }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type a message..."
              style={{
                flex: 1,
                padding: '0.75rem',
                background: '#4a5568',
                border: 'none',
                borderRadius: '0.375rem',
                color: 'white',
                fontSize: '0.875rem'
              }}
            />
            <button
              onClick={handleSendMessage}
              style={{
                padding: '0.75rem 1rem',
                background: '#6366f1',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer'
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
