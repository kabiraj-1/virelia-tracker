import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './SimpleLocation.css';

const SimpleLocation = () => {
  const { user } = useAuth();
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [distance, setDistance] = useState(0);

  const getLocation = () => {
    setIsLoading(true);
    setError('');
    
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // Get address using OpenStreetMap (no API key needed)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          
          setLocation({
            latitude,
            longitude,
            address: data.display_name || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            timestamp: new Date().toISOString()
          });
        } catch (err) {
          setLocation({
            latitude,
            longitude,
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            timestamp: new Date().toISOString()
          });
        }
        
        setIsLoading(false);
      },
      (err) => {
        setError(`Error getting location: ${err.message}`);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const shareLocation = async () => {
    if (!location) return;
    
    try {
      // Save to backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/locations/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId: user?._id,
          location: {
            latitude: location.latitude,
            longitude: location.longitude,
            address: location.address
          }
        })
      });
      
      if (response.ok) {
        alert('Location shared successfully!');
      }
    } catch (err) {
      console.error('Error sharing location:', err);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className="simple-location">
      <div className="location-header">
        <h2>📍 Live Location Tracker</h2>
        <p>Share your real-time location with friends</p>
      </div>

      <div className="location-card">
        <div className="card-header">
          <h3>Your Current Location</h3>
          <button 
            className="refresh-btn"
            onClick={getLocation}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : '🔄 Refresh'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        {location && (
          <div className="location-details">
            <div className="coordinates">
              <div className="coord">
                <span className="label">Latitude:</span>
                <span className="value">{location.latitude.toFixed(6)}</span>
              </div>
              <div className="coord">
                <span className="label">Longitude:</span>
                <span className="value">{location.longitude.toFixed(6)}</span>
              </div>
            </div>
            
            <div className="address-section">
              <h4>📍 Address:</h4>
              <p className="address">{location.address}</p>
            </div>
            
            <div className="time-section">
              <span>🕒 Last updated: {new Date(location.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        )}

        <div className="location-actions">
          <button 
            className="action-btn primary"
            onClick={getLocation}
            disabled={isLoading}
          >
            📍 Get Current Location
          </button>
          
          <button 
            className="action-btn secondary"
            onClick={shareLocation}
            disabled={!location}
          >
            📤 Share with Friends
          </button>
          
          <button 
            className="action-btn success"
            onClick={() => {
              if (location) {
                const mapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
                window.open(mapsUrl, '_blank');
              }
            }}
            disabled={!location}
          >
            🗺️ Open in Google Maps
          </button>
        </div>
      </div>

      <div className="location-features">
        <h3>🚀 Location Features</h3>
        <div className="features-grid">
          <div className="feature">
            <div className="feature-icon">📍</div>
            <h4>Real-time Tracking</h4>
            <p>Share your live location with selected friends</p>
          </div>
          
          <div className="feature">
            <div className="feature-icon">👥</div>
            <h4>Friend Locations</h4>
            <p>See where your friends are in real-time</p>
          </div>
          
          <div className="feature">
            <div className="feature-icon">📊</div>
            <h4>Distance Calculator</h4>
            <p>Calculate distance between you and friends</p>
          </div>
          
          <div className="feature">
            <div className="feature-icon">🔔</div>
            <h4>Proximity Alerts</h4>
            <p>Get notified when friends are nearby</p>
          </div>
        </div>
      </div>

      <div className="location-tips">
        <h4>💡 Tips for Better Location Accuracy:</h4>
        <ul>
          <li>Enable GPS on your device</li>
          <li>Grant location permissions to browser</li>
          <li>Use WiFi for more accurate positioning</li>
          <li>Keep location services enabled</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleLocation;