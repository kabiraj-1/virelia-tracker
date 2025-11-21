import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Notifications from '../notifications/Notifications';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.reload();
  };

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      borderBottom: '1px solid #4a5568',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          íº€ Virelia Tracker
        </h1>
        
        {user && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href="#feed" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem'
            }}>Feed</a>
            <a href="#friends" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem'
            }}>Friends</a>
            <a href="#activity" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem'
            }}>Activity</a>
            <a href="#goals" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem'
            }}>Goals</a>
            <a href="#communities" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem'
            }}>Communities</a>
            <a href="#analytics" style={{ 
              color: 'white', 
              textDecoration: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem'
            }}>Analytics</a>
          </div>
        )}
      </div>

      {user ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Notifications />
          <div style={{
            width: '35px',
            height: '35px',
            background: '#6366f1',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.875rem'
          }}>
            {user.name.charAt(0)}
          </div>
          <span>Hi, {user.name.split(' ')[0]}!</span>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              background: '#e53e3e',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            Logout
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{
            padding: '0.5rem 1rem',
            background: 'transparent',
            color: 'white',
            border: '1px solid white',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}>
            Login
          </button>
          <button style={{
            padding: '0.5rem 1rem',
            background: '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            cursor: 'pointer'
          }}>
            Sign Up
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
