import api from './api';

const API_BASE = '/api/social/events';

export const eventService = {
  getEvents: async (filters = {}) => {
    const response = await api.get(API_BASE, { params: filters });
    return response.data;
  },

  getEvent: async (eventId) => {
    const response = await api.get(`${API_BASE}/${eventId}`);
    return response.data;
  },

  createEvent: async (eventData) => {
    const response = await api.post(API_BASE, eventData);
    return response.data.event;
  },

  joinEvent: async (eventId) => {
    const response = await api.post(`${API_BASE}/${eventId}/join`);
    return response.data;
  },

  updateEvent: async (eventId, updates) => {
    const response = await api.put(`${API_BASE}/${eventId}`, updates);
    return response.data;
  },

  deleteEvent: async (eventId) => {
    const response = await api.delete(`${API_BASE}/${eventId}`);
    return response.data;
  }
};