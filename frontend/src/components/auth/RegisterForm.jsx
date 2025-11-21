import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const RegisterForm = ({ onToggleMode }) => {
  const { register, loading, error, clearError } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      clearError();
      alert('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      clearError();
      alert('Password must be at least 6 characters');
      return;
    }

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
    } catch (error) {
      // Error is handled by AuthContext
    }
  };

  return (
    <div style={{
      background: '#2d3748',
      padding: '2rem',
      borderRadius: '0.5rem',
      maxWidth: '400px',
      width: '100%'
    }}>
      <h2 style={{
        textAlign: 'center',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Create Account
      </h2>

      {error && (
        <div style={{
          background: '#fed7d7',
          color: '#c53030',
          padding: '1rem',
          borderRadius: '0.375rem',
          marginBottom: '1rem',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            color: '#a0aec0',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#4a5568',
              border: '1px solid #4a5568',
              borderRadius: '0.375rem',
              color: 'white',
              fontSize: '1rem'
            }}
            placeholder="Enter your full name"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            color: '#a0aec0',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#4a5568',
              border: '1px solid #4a5568',
              borderRadius: '0.375rem',
              color: 'white',
              fontSize: '1rem'
            }}
            placeholder="Enter your email"
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{
            display: 'block',
            color: '#a0aec0',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#4a5568',
              border: '1px solid #4a5568',
              borderRadius: '0.375rem',
              color: 'white',
              fontSize: '1rem'
            }}
            placeholder="Enter your password"
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{
            display: 'block',
            color: '#a0aec0',
            marginBottom: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}>
            Confirm Password
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            style={{
              width: '100%',
              padding: '0.75rem',
              background: '#4a5568',
              border: '1px solid #4a5568',
              borderRadius: '0.375rem',
              color: 'white',
              fontSize: '1rem'
            }}
            placeholder="Confirm your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: loading ? '#4a5568' : '#6366f1',
            color: 'white',
            border: 'none',
            borderRadius: '0.375rem',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <div style={{
        textAlign: 'center',
        marginTop: '1.5rem',
        paddingTop: '1.5rem',
        borderTop: '1px solid #4a5568'
      }}>
        <p style={{ color: '#a0aec0', margin: 0 }}>
          Already have an account?{' '}
          <button
            onClick={onToggleMode}
            style={{
              background: 'none',
              border: 'none',
              color: '#6366f1',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
