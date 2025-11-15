import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Location = () => {
  const [position, setPosition] = useState([27.7172, 85.3240]); // Kathmandu
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Try to get user's actual location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => {
          console.log('Geolocation error:', err);
        }
      );
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Live Location Tracking</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Status</h3>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm inline-block">
            ✅ Active
          </div>
          <p className="text-gray-600 mt-2 text-sm">Real-time tracking enabled</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Backend API</h3>
          <p className="text-green-600 text-sm">Connected</p>
          <p className="text-gray-600 mt-1 text-xs break-all">
            https://virelia-tracker.onrender.com/api/location
          </p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Your Location</h3>
          <p className="text-gray-600 text-sm">
            {userLocation 
              ? `Lat: ${userLocation[0].toFixed(4)}, Lng: ${userLocation[1].toFixed(4)}`
              : 'Getting location...'
            }
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-96 w-full">
          <MapContainer 
            center={position} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                Virelia Tracker Headquarters <br /> Kathmandu, Nepal
              </Popup>
            </Marker>
            {userLocation && (
              <Marker position={userLocation}>
                <Popup>
                  Your Current Location
                </Popup>
              </Marker>
            )}
          </MapContainer>
        </div>
      </div>

      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Location Features</h3>
        <ul className="text-blue-700 list-disc list-inside space-y-1">
          <li>Real-time GPS tracking</li>
          <li>Interactive maps with React Leaflet</li>
          <li>Location history and analytics</li>
          <li>Geofencing capabilities</li>
          <li>Multi-user location sharing</li>
        </ul>
      </div>
    </div>
  );
};

export default Location;
