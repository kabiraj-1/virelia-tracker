import React, { useState, useEffect, useCallback } from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useSocket } from '../../hooks/useSocket';
import LocationMap from './LocationMap';
import SessionManager from './SessionManager';
import { Share2, Navigation, MapPin, Clock } from 'lucide-react';

const LocationTracker = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const [liveLocations, setLiveLocations] = useState([]);
  const [stats, setStats] = useState({
    sharedCount: 0,
    activeSessions: 0,
    accuracy: 0
  });

  const { 
    position, 
    error: geoError, 
    getPosition,
    isWatching,
    startWatching,
    stopWatching 
  } = useGeolocation();

  const { socket, isConnected } = useSocket();

  // Start sharing location
  const startSharing = useCallback(async () => {
    try {
      await startWatching();
      setIsSharing(true);
      
      // Create new session
      const sessionResponse = await fetch('/api/locations/sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          name: `Live Session ${new Date().toLocaleTimeString()}`,
          description: 'Real-time location sharing session'
        })
      });

      const sessionData = await sessionResponse.json();
      if (sessionData.success) {
        setCurrentSession(sessionData.session);
      }
    } catch (error) {
      console.error('Failed to start sharing:', error);
    }
  }, [startWatching]);

  // Stop sharing location
  const stopSharing = useCallback(() => {
    stopWatching();
    setIsSharing(false);
    
    // Update session to inactive
    if (currentSession) {
      fetch(`/api/locations/sessions/${currentSession._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ isActive: false })
      });
    }
  }, [stopWatching, currentSession]);

  // Share location when position updates
  useEffect(() => {
    if (isSharing && position && currentSession) {
      shareLocation(position);
    }
  }, [position, isSharing, currentSession]);

  const shareLocation = async (pos) => {
    try {
      const response = await fetch('/api/locations/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          sessionId: currentSession._id,
          metadata: {
            accuracy: pos.coords.accuracy,
            altitude: pos.coords.altitude,
            speed: pos.coords.speed,
            heading: pos.coords.heading
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setStats(prev => ({
          ...prev,
          sharedCount: prev.sharedCount + 1,
          accuracy: pos.coords.accuracy
        }));
      }
    } catch (error) {
      console.error('Failed to share location:', error);
    }
  };

  // Socket listeners for real-time updates
  useEffect(() => {
    if (!socket) return;

    const handleLocationUpdate = (data) => {
      setLiveLocations(prev => {
        const existingIndex = prev.findIndex(loc => 
          loc.user._id === data.location.user
        );
        
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...data.location,
            user: data.session.user
          };
          return updated;
        } else {
          return [...prev, {
            ...data.location,
            user: data.session.user
          }];
        }
      });
    };

    socket.on('location_update', handleLocationUpdate);

    return () => {
      socket.off('location_update', handleLocationUpdate);
    };
  }, [socket]);

  const getCurrentLocation = async () => {
    const pos = await getPosition();
    if (pos) {
      // Show current location on map temporarily
      const tempLocation = {
        _id: 'current',
        coordinates: [pos.coords.longitude, pos.coords.latitude],
        timestamp: new Date(),
        metadata: { accuracy: pos.coords.accuracy },
        user: { username: 'You', profile: { firstName: 'Current', lastName: 'Location' } }
      };
      
      setLiveLocations(prev => [
        ...prev.filter(loc => loc._id !== 'current'),
        tempLocation
      ]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Share2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Locations Shared
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.sharedCount}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Navigation className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Status
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {isSharing ? 'Sharing' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Accuracy
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {stats.accuracy ? `${stats.accuracy.toFixed(1)}m` : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Connection
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {isConnected ? 'Live' : 'Offline'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={isSharing ? stopSharing : startSharing}
          className={`px-6 py-3 rounded-lg font-medium transition-colors ${
            isSharing
              ? 'bg-red-600 hover:bg-red-700 text-white'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
        >
          {isSharing ? 'Stop Sharing' : 'Start Sharing'}
        </button>

        <button
          onClick={getCurrentLocation}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          Get Current Location
        </button>

        <SessionManager 
          currentSession={currentSession}
          onSessionChange={setCurrentSession}
        />
      </div>

      {/* Error Display */}
      {geoError && (
        <div className="bg-red-50 dark:bg-red-900/50 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">
            Location Error: {geoError}
          </p>
        </div>
      )}

      {/* Map */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <LocationMap
          locations={liveLocations}
          center={position ? [position.coords.latitude, position.coords.longitude] : undefined}
          height="500px"
          currentUserLocation={
            position ? {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy
            } : null
          }
        />
      </div>

      {/* Active Sessions */}
      {currentSession && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Active Session
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {currentSession.name} - Started {new Date(currentSession.createdAt).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationTracker;