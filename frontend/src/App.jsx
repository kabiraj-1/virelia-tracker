import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Router from './components/Router';

const AppContent = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #ffffff33',
            borderTop: '4px solid white',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p>Loading Virelia Tracker...</p>
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      color: 'white'
    }}>
      <Navbar />
      
      {user ? (
        <Router />
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 'calc(100vh - 80px)',
          padding: '2rem'
        }}>
          <div style={{
            background: '#2d3748',
            padding: '2rem',
            borderRadius: '0.5rem',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center'
          }}>
            <h2 style={{
              marginBottom: '2rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '2rem'
            }}>
              íº€ Virelia Tracker
            </h2>
            
            <p style={{ marginBottom: '2rem', color: '#a0aec0' }}>
              Your social productivity companion. Track goals, share progress, and connect with friends.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button 
                onClick={() => {
                  // Mock login for demo
                  const mockUser = {
                    id: 1,
                    name: 'Demo User',
                    email: 'demo@virelia.com'
                  };
                  localStorage.setItem('virelia_user', JSON.stringify(mockUser));
                  window.location.reload();
                }}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: '#6366f1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600'
                }}
              >
                Try Demo
              </button>
              <button style={{
                padding: '0.75rem 1.5rem',
                background: 'transparent',
                color: 'white',
                border: '1px solid #6366f1',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '1rem'
              }}>
                Learn More
              </button>
            </div>

            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #4a5568' }}>
              <p style={{ color: '#718096', fontSize: '0.875rem' }}>
                Join our community of productivity enthusiasts
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
