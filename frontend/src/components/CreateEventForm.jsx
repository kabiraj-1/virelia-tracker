import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const CreateEventForm = ({ onCancel, onEventCreated }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'community',
    location: {
      address: '',
      city: '',
      online: false
    },
    dateTime: {
      start: '',
      end: ''
    },
    capacity: 0,
    karmaPoints: 10
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { user } = useAuth();

  const API_URL = 'https://virelia-tracker.onrender.com/api';

  const eventTypes = [
    { value: 'environment', label: '��� Environment' },
    { value: 'education', label: '��� Education' },
    { value: 'healthcare', label: '��� Healthcare' },
    { value: 'community', label: '��� Community' },
    { value: 'animals', label: '��� Animals' },
    { value: 'elderly', label: '��� Elderly Care' },
    { value: 'children', label: '��� Children' },
    { value: 'disaster_relief', label: '��� Disaster Relief' },
    { value: 'other', label: '��� Other' }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else if (name.startsWith('dateTime.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        dateTime: {
          ...prev.dateTime,
          [field]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'number' ? parseInt(value) : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    // Validation
    if (!formData.title || !formData.description || !formData.dateTime.start || !formData.dateTime.end) {
      setMessage('Please fill in all required fields');
      setLoading(false);
      return;
    }

    if (new Date(formData.dateTime.start) >= new Date(formData.dateTime.end)) {
      setMessage('End date must be after start date');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Event created successfully!');
        setTimeout(() => {
          onEventCreated(data.event);
        }, 1000);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error creating event: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '20px auto', 
      padding: '30px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      background: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <h2>��� Create New Event</h2>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          margin: '10px 0', 
          borderRadius: '4px',
          backgroundColor: message.includes('successfully') ? '#d4edda' : '#f8d7da',
          color: message.includes('successfully') ? '#155724' : '#721c24',
          border: `1px solid ${message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Event Title */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Event Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter event title"
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              boxSizing: 'border-box',
              fontSize: '16px'
            }}
          />
        </div>

        {/* Event Description */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            placeholder="Describe your event..."
            rows="4"
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              boxSizing: 'border-box',
              fontSize: '16px',
              resize: 'vertical'
            }}
          />
        </div>

        {/* Event Type */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Event Type *
          </label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            required
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ccc', 
              borderRadius: '4px',
              boxSizing: 'border-box',
              fontSize: '16px'
            }}
          >
            {eventTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Date and Time */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Start Date & Time *
            </label>
            <input
              type="datetime-local"
              name="dateTime.start"
              value={formData.dateTime.start}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              End Date & Time *
            </label>
            <input
              type="datetime-local"
              name="dateTime.end"
              value={formData.dateTime.end}
              onChange={handleChange}
              required
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Location */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
            Location
          </label>
          <div style={{ marginBottom: '10px' }}>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleChange}
              placeholder="Address"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                boxSizing: 'border-box',
                marginBottom: '10px'
              }}
            />
            <input
              type="text"
              name="location.city"
              value={formData.location.city}
              onChange={handleChange}
              placeholder="City"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type="checkbox"
              name="location.online"
              checked={formData.location.online}
              onChange={handleChange}
            />
            Online Event
          </label>
        </div>

        {/* Capacity and Karma Points */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Capacity (0 for unlimited)
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="0"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Karma Points ⭐
            </label>
            <input
              type="number"
              name="karmaPoints"
              value={formData.karmaPoints}
              onChange={handleChange}
              min="1"
              max="100"
              style={{ 
                width: '100%', 
                padding: '10px', 
                border: '1px solid #ccc', 
                borderRadius: '4px',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#6c757d' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '16px'
            }}
          >
            {loading ? 'Creating...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEventForm;
