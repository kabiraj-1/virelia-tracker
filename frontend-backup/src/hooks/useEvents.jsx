import { useState, useEffect } from 'react';
import { eventService } from '../services/eventService';

export const useEvents = (filters = {}) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadEvents();
  }, [filters]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventService.getEvents(filters);
      setEvents(eventsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData) => {
    try {
      const newEvent = await eventService.createEvent(eventData);
      setEvents(prev => [newEvent, ...prev]);
      return newEvent;
    } catch (err) {
      throw err;
    }
  };

  const joinEvent = async (eventId) => {
    try {
      await eventService.joinEvent(eventId);
      await loadEvents(); // Refresh events
    } catch (err) {
      throw err;
    }
  };

  return {
    events,
    loading,
    error,
    createEvent,
    joinEvent,
    refreshEvents: loadEvents
  };
};