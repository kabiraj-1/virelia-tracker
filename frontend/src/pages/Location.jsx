import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Share2, Navigation, Users } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

const Location = () => {
  const [position, setPosition] = useState(null);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          });
        },
        (error) => {
          console.error('Location error:', error);
          // Default to Kathmandu
          setPosition({ lat: 27.7172, lng: 85.3240 });
        }
      );
    }
  }, []);

  const startSharing = () => {
    setIsSharing(true);
    // Implement location sharing logic
  };

  const stopSharing = () => {
    setIsSharing(false);
    // Stop location sharing
  };

  if (!position) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Location Sharing
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Share your location and track others in real-time
          </p>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={isSharing ? stopSharing : startSharing}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isSharing
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-primary-500 hover:bg-primary-600 text-white'
            }`}
          >
            <Share2 className="w-4 h-4" />
            <span>{isSharing ? 'Stop Sharing' : 'Start Sharing'}</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="h-96">
          <MapContainer
            center={position}
            zoom={13}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position}>
              <Popup>
                Your current location
                <br />
                {isSharing ? 'Sharing active' : 'Not sharing'}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {/* Location Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Navigation className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Live Tracking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isSharing ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
              <Users className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Active Sessions</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">3 people nearby</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Share2 className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 dark:text-white">Share Status</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {isSharing ? 'Public' : 'Private'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Location;