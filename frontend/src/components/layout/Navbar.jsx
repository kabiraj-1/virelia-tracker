import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
          ÌæØ Virelia Tracker
        </Link>
        
        <div className="nav-menu">
          {user ? (
            <>
              <Link 
                to="/" 
                className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
              >
                Ì≥ä Dashboard
              </Link>
              <Link 
                to="/goals" 
                className={`nav-link ${location.pathname === '/goals' ? 'active' : ''}`}
              >
                ÌæØ Goals
              </Link>
              <Link 
                to="/friends" 
                className={`nav-link ${location.pathname === '/friends' ? 'active' : ''}`}
              >
                Ì±• Friends
              </Link>
              <Link 
                to="/feed" 
                className={`nav-link ${location.pathname === '/feed' ? 'active' : ''}`}
              >
                Ì≥± Posts
              </Link>
              <button onClick={handleLogout} className="nav-link logout-btn">
                Ì∫™ Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
              >
                Ì¥ê Login
              </Link>
              <Link 
                to="/register" 
                className={`nav-link ${location.pathname === '/register' ? 'active' : ''}`}
              >
                Ì≥ù Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
