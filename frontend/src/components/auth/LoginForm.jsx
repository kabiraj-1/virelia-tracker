import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Auth.css';

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, user, error, setError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Clear error when component unmounts or form changes
  useEffect(() => {
    return () => setError('');
  }, [setError]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Attempting login with:', { email: formData.email });
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        console.log('Login successful, redirecting to dashboard...');
        navigate('/dashboard');
      } else {
        console.error('Login failed:', result.error);
      }
    } catch (error) {
      console.error('Login form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome Back! í±‹</h1>
          <p>Sign in to continue your productivity journey</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={isSubmitting}
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up here
            </Link>
          </p>
        </div>

        {/* Debug info - remove in production */}
        <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '5px', fontSize: '12px' }}>
          <strong>Debug Info:</strong><br />
          API URL: {import.meta.env.VITE_API_URL}<br />
          Email: {formData.email}<br />
          Submitting: {isSubmitting.toString()}
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
