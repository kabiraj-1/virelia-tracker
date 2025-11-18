import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      console.log('Registering user:', formData);
      const response = await api.auth.register(formData);
      console.log('Registration success:', response);
      
      // Redirect to login on success
      navigate('/login', { 
        state: { message: 'Registration successful! Please login.' }
      });
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '2rem auto', 
      padding: '2rem',
      border: '1px solid #ddd',
      borderRadius: '8px'
    }}>
      <h2>Create Account</h2>
      {error && (
        <div style={{ 
          color: 'red', 
          background: '#ffe6e6', 
          padding: '0.5rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              marginTop: '0.25rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              marginTop: '0.25rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              marginTop: '0.25rem',
              border: '1px solid #ccc',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={{
            width: '100%',
            padding: '0.75rem',
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '1rem' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
