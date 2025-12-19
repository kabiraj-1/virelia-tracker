import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
           Virelia Tracker
        </Link>
        
        <div className="nav-menu">
          {user ? (
            <>
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                 Dashboard
              </Link>
              <Link 
                to="/goals" 
                className={`nav-link ${location.pathname === '/goals' ? 'active' : ''}`}
              >
                 Goals
              </Link>
              <Link 
                to="/activities" 
                className={`nav-link ${location.pathname === '/activities' ? 'active' : ''}`}
              >
                ⏱️ Activities
              </Link>
              <Link 
                to="/friends" 
                className={`nav-link ${location.pathname === '/friends' ? 'active' : ''}`}
              >
                 Friends
              </Link>
              <Link 
                to="/friends" 
                className={`nav-link ${location.pathname === '/feed' ? 'active' : ''}`}
              >
                 feed
              </Link>
              <Link 
                to="/profile" 
                className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}
              >
                 Profile
              </Link>
              <Link 
                to="/feed" 
                className={`nav-link ${location.pathname === '/feed' ? 'active' : ''}`}
              >
                 Posts
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                ��� Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                 Login
              </Link>
              <Link 
                to="/register" 
                className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
              >
                 Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
