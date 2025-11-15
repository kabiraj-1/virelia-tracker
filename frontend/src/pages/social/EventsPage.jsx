import React, { useState } from 'react';
import { useSocial } from '../../contexts/social/SocialContext';
import { useAuth } from '../../contexts/AuthContext';
import EventCard from '../../components/social/EventCard';

const EventsPage = () => {
  const { events, createEvent, loading } = useSocial();
  const { user } = useAuth();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    maxParticipants: 50
  });

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await createEvent(formData);
      setShowCreateForm(false);
      setFormData({ title: '', description: '', date: '', maxParticipants: 50 });
      alert('Event created successfully!');
    } catch (error) {
      alert('Error creating event: ' + error.response?.data?.message);
    }
  };

  if (loading) return <div>Loading events...</div>;

  return (
    <div className="events-page">
      <div className="page-header">
        <h1>Community Events</h1>
        {user && (
          <button 
            onClick={() => setShowCreateForm(true)}
            className="create-event-btn"
          >
            + Create Event
          </button>
        )}
      </div>

      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Event</h2>
            <form onSubmit={handleCreateEvent}>
              <input
                type="text"
                placeholder="Event Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
              <textarea
                placeholder="Event Description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                required
              />
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
              <input
                type="number"
                placeholder="Max Participants"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({...formData, maxParticipants: e.target.value})}
                min="1"
              />
              <div className="form-actions">
                <button type="submit">Create Event</button>
                <button type="button" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="events-grid">
        {events.map(event => (
          <EventCard key={event._id} event={event} />
        ))}
      </div>

      {events.length === 0 && (
        <div className="empty-state">
          <p>No events yet. Be the first to create one!</p>
        </div>
      )}
    </div>
  );
};

export default EventsPage;