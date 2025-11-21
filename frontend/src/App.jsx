import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/layout/Navbar';
import Router from './components/Router';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

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
      {user ? (
        <>
          <Navbar />
          <Router />
        </>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          padding: '2rem'
        }}>
          <div style={{
            textAlign: 'center',
            maxWidth: '500px',
            width: '100%'
          }}>
            <h1 style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: '3rem',
              marginBottom: '1rem'
            }}>
              íº€ Virelia Tracker
            </h1>
            
            <p style={{ 
              color: '#a0aec0', 
              fontSize: '1.2rem',
              marginBottom: '2rem'
            }}>
              Your social productivity companion. Track goals, share progress, and connect with friends.
            </p>

            {authMode === 'login' ? (
              <LoginForm onToggleMode={() => setAuthMode('register')} />
            ) : (
              <RegisterForm onToggleMode={() => setAuthMode('login')} />
            )}

            <div style={{ 
              marginTop: '2rem', 
              paddingTop: '2rem', 
              borderTop: '1px solid #4a5568' 
            }}>
              <p style={{ 
                color: '#718096', 
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
                Join thousands of productivity enthusiasts tracking their goals, 
                sharing progress, and building better habits together.
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
