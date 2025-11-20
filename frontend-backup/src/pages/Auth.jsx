import React, { useState } from 'react';
import './Auth.css';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="auth">
      <div className="auth-container">
        <div className="auth-card">
          <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
          <form className="auth-form">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                className="auth-input"
              />
            )}
            <input
              type="email"
              placeholder="Email Address"
              className="auth-input"
            />
            <input
              type="password"
              placeholder="Password"
              className="auth-input"
            />
            <button type="submit" className="auth-button">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>
          <p className="auth-toggle">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              className="toggle-link"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
