import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const EventsList = ({ onEventCreate, onEventSelect }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  const API_URL = 'https://virelia-tracker.onrender.com/api';

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/events`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      setEvents(data.events || []);
    } catch (error) {
      setError('Error loading events: ' + error.message);
      console.error('Events fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ... (rest of the EventsList component code)
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <h2>í³… Community Events</h2>
      {loading && <p>Loading events...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      {/* Events list will be implemented here */}
    </div>
  );
};

export default EventsList;
