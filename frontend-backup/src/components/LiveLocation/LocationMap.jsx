import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const LocationMap = ({ 
  locations = [], 
  center = [27.7172, 85.3240], // Kathmandu default
  zoom = 13,
  height = '400px',
  onLocationClick,
  currentUserLocation 
}) => {
  const mapRef = useRef();
  const [userMarker, setUserMarker] = useState(null);

  // Custom icon for current user
  const currentUserIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMTIiIGN5PSIxMiIgcj0iMTAiIGZpbGw9IiMwMDUyQ0MiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjkiIHI9IjMiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik0xMiAxNUM5IDE1IDYgMTYgNiAxOXYxaDEydi0xYzAtMy0zLTQtNi00eiIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });

  const MapUpdater = ({ center, zoom }) => {
    const map = useMap();
    
    useEffect(() => {
      if (center) {
        map.setView(center, zoom);
      }
    }, [center, zoom, map]);

    return null;
  };

  const handleMarkerClick = (location) => {
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  return (
    <div className="location-map rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height, width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapUpdater center={center} zoom={zoom} />

        {/* Current user location */}
        {currentUserLocation && (
          <Marker
            position={[currentUserLocation.latitude, currentUserLocation.longitude]}
            icon={currentUserIcon}
          >
            <Popup>
              <div className="text-center">
                <strong>Your Location</strong>
                <br />
                <span className="text-sm text-gray-600">
                  Accuracy: {currentUserLocation.accuracy?.toFixed(1)}m
                </span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Other locations */}
        {locations.map((location, index) => (
          <Marker
            key={location._id || index}
            position={[location.coordinates[1], location.coordinates[0]]}
            eventHandlers={{
              click: () => handleMarkerClick(location)
            }}
          >
            <Popup>
              <div className="max-w-xs">
                {location.user && (
                  <>
                    <div className="font-semibold text-gray-900">
                      {location.user.username}
                    </div>
                    {location.user.profile?.firstName && (
                      <div className="text-sm text-gray-600">
                        {location.user.profile.firstName} {location.user.profile.lastName}
                      </div>
                    )}
                  </>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Updated: {new Date(location.timestamp).toLocaleTimeString()}
                </div>
                {location.metadata && (
                  <div className="text-xs text-gray-500">
                    Speed: {location.metadata.speed?.toFixed(1) || 0} m/s
                    {location.metadata.accuracy && (
                      <> · Accuracy: {location.metadata.accuracy.toFixed(1)}m</>
                    )}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LocationMap;