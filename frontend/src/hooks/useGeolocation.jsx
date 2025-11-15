import { useState, useEffect, useCallback } from 'react';

export const useGeolocation = (options = {}) => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [isWatching, setIsWatching] = useState(false);
  const [watchId, setWatchId] = useState(null);

  const defaultOptions = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000,
    ...options
  };

  const getPosition = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = new Error('Geolocation is not supported');
        setError(error.message);
        reject(error);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition(pos);
          setError(null);
          resolve(pos);
        },
        (err) => {
          const errorMessage = getErrorMessage(err);
          setError(errorMessage);
          reject(new Error(errorMessage));
        },
        defaultOptions
      );
    });
  }, [defaultOptions]);

  const startWatching = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = new Error('Geolocation is not supported');
        setError(error.message);
        reject(error);
        return;
      }

      if (isWatching) {
        resolve();
        return;
      }

      const id = navigator.geolocation.watchPosition(
        (pos) => {
          setPosition(pos);
          setError(null);
          if (!isWatching) {
            setIsWatching(true);
          }
        },
        (err) => {
          const errorMessage = getErrorMessage(err);
          setError(errorMessage);
          setIsWatching(false);
        },
        defaultOptions
      );

      setWatchId(id);
      setIsWatching(true);
      resolve();
    });
  }, [isWatching, defaultOptions]);

  const stopWatching = useCallback(() => {
    if (watchId && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsWatching(false);
    }
  }, [watchId]);

  useEffect(() => {
    return () => {
      stopWatching();
    };
  }, [stopWatching]);

  const getErrorMessage = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied. Please enable location permissions.';
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable.';
      case error.TIMEOUT:
        return 'Location request timed out.';
      default:
        return 'An unknown error occurred while getting location.';
    }
  };

  return {
    position,
    error,
    getPosition,
    startWatching,
    stopWatching,
    isWatching
  };
};