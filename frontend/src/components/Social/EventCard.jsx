import React from 'react';
import { useSocial } from '../../contexts/social/SocialContext';
import { useAuth } from '../../contexts/AuthContext';

const EventCard = ({ event }) => {
  const { joinEvent } = useSocial();
  const { user } = useAuth();

  const handleJoin = async () => {
    if (!user) {
      alert('Please login to join events');
      return;
    }
    try {
      await joinEvent(event._id);
      alert('Successfully joined the event!');
    } catch (error) {
      alert('Error joining event: ' + error.response?.data?.message);
    }
  };

  const isParticipant = event.participants?.some(p => p._id === user?.id);
  const isFull = event.participants?.length >= event.maxParticipants;

  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <div className="event-details">
        <span>📅 {new Date(event.date).toLocaleDateString()}</span>
        <span>👥 {event.participants?.length || 0}/{event.maxParticipants}</span>
        <span>⭐ {event.karmaPoints} karma</span>
      </div>
      <button 
        onClick={handleJoin}
        disabled={isParticipant || isFull || !user}
        className={`join-btn ${isParticipant ? 'joined' : ''}`}
      >
        {isParticipant ? 'Joined' : isFull ? 'Full' : 'Join Event'}
      </button>
    </div>
  );
};

export default EventCard;