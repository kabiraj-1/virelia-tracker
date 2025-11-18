import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Virelia
        </Link>

        <div className="nav-menu">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>
          <Link to="/feed" className={`nav-link ${location.pathname === '/feed' ? 'active' : ''}`}>
            Feed
          </Link>
          <Link to="/events" className={`nav-link ${location.pathname === '/events' ? 'active' : ''}`}>
            Events
          </Link>
          <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
            Profile
          </Link>
        </div>

        <div className="nav-auth">
          <Link to="/login" className="login-btn" style={{ marginRight: '1rem' }}>
            Login
          </Link>
          <Link to="/register" className="signup-btn">
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
