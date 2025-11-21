import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">íº€ Virelia Tracker</Link>
      </div>
      
      <div className="nav-links">
        <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
          Dashboard
        </Link>
        <Link to="/feed" className={location.pathname === '/feed' ? 'active' : ''}>
          Feed
        </Link>
        <Link to="/friends" className={location.pathname === '/friends' ? 'active' : ''}>
          Friends
        </Link>
        <Link to="/activities" className={location.pathname === '/activities' ? 'active' : ''}>
          Activity
        </Link>
        <Link to="/goals" className={location.pathname === '/goals' ? 'active' : ''}>
          Goals
        </Link>
        <Link to="/communities" className={location.pathname === '/communities' ? 'active' : ''}>
          Communities
        </Link>
        <Link to="/analytics" className={location.pathname === '/analytics' ? 'active' : ''}>
          Analytics
        </Link>
      </div>

      <div className="nav-user">
        {user ? (
          <div className="user-menu">
            <span>Hi, {user.name || 'User'}!</span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        ) : (
          <div className="auth-links">
            <Link to="/login" className="login-btn">Login</Link>
            <Link to="/register" className="register-btn">Sign Up</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
