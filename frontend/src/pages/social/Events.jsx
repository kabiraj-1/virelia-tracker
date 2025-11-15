import React, { useState } from 'react';
import { useSocial } from '../../contexts/SocialContext';
import EventCard from '../../components/social/Events/EventCard';
import CreateEventModal from '../../components/social/Events/CreateEventModal';

const EventsPage = () => {
  const { events, loading } = useSocial();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-8">Loading events...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Community Events</h1>
            <p className="text-gray-600 mt-2">Join events and earn karma points</p>
          </div>
          
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Create Event
          </button>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-6">
          {['all', 'upcoming', 'ongoing', 'completed'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full capitalize ${
                filter === status
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        <div className="space-y-4">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No events found</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? 'Be the first to create an event!'
                  : `No ${filter} events at the moment.`
                }
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
                >
                  Create First Event
                </button>
              )}
            </div>
          ) : (
            filteredEvents.map(event => (
              <EventCard key={event._id} event={event} />
            ))
          )}
        </div>
      </div>

      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default EventsPage;