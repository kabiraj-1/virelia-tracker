import React from 'react';
import './Events.css';

const Events = () => {
  const events = [
    {
      id: 1,
      title: 'Community Cleanup',
      date: 'Nov 20, 2024',
      location: 'Central Park',
      participants: 15,
      maxParticipants: 30
    },
    {
      id: 2,
      title: 'Yoga Session',
      date: 'Nov 22, 2024', 
      location: 'Community Center',
      participants: 8,
      maxParticipants: 20
    }
  ];

  return (
    <div className="events">
      <div className="events-container">
        <h1>Upcoming Events</h1>
        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <p>Ì≥Ö {event.date}</p>
              <p>Ì≥ç {event.location}</p>
              <p>Ì±• {event.participants}/{event.maxParticipants} participants</p>
              <button className="join-btn">Join Event</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Events;
