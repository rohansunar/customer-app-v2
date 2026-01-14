/**
 * Hook for managing location data, including getting current location,
 * handling permissions, and error management.
 */

import * as Location from 'expo-location';
import { useCallback, useEffect, useState } from 'react';
import {
  LocationError,
  Location as LocationType,
  UseLocationReturn,
} from '../types';

/**
 * Hook to get the current location of the device.
 * Handles permissions, location fetching, and error states.
 */
export function useLocation(): UseLocationReturn {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<LocationError | null>(null);

  const getCurrentLocation = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Request permissions
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      // Get current position
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const loc: LocationType = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      setLocation(loc);
    } catch (err) {
      const locationError: LocationError = {
        code: 'LOCATION_ERROR',
        message: err instanceof Error ? err.message : 'Failed to get location',
      };
      setError(locationError);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  return {
    location,
    loading,
    error,
    refetch,
  };
}
