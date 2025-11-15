import React from 'react';
import { format } from 'date-fns';
import { useAuth } from '../../../contexts/AuthContext';
import { useSocial } from '../../../contexts/SocialContext';

const EventCard = ({ event }) => {
  const { user } = useAuth();
  const { joinEvent } = useSocial();

  const handleJoinEvent = async () => {
    try {
      await joinEvent(event._id);
    } catch (error) {
      console.error('Error joining event:', error);
    }
  };

  const isParticipant = event.participants.some(p => p._id === user?.id);
  const isCreator = event.creator._id === user?.id;
  const isFull = event.participants.length >= event.maxParticipants;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 border border-gray-200">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
          event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {event.status}
        </span>
      </div>

      <p className="text-gray-600 mb-4">{event.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-500">
        <div className="flex items-center">
          <span className="mr-2">📅</span>
          {format(new Date(event.date), 'MMM dd, yyyy - HH:mm')}
        </div>
        <div className="flex items-center">
          <span className="mr-2">👥</span>
          {event.participants.length} / {event.maxParticipants} participants
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={event.creator.avatar || '/default-avatar.png'}
            alt={event.creator.username}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-sm text-gray-600">by {event.creator.username}</span>
        </div>

        {!isCreator && (
          <button
            onClick={handleJoinEvent}
            disabled={isParticipant || isFull}
            className={`px-4 py-2 rounded-lg font-medium ${
              isParticipant
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isFull
                ? 'bg-red-300 text-red-700 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isParticipant ? 'Joined' : isFull ? 'Full' : 'Join Event'}
          </button>
        )}
      </div>
    </div>
  );
};

export default EventCard;