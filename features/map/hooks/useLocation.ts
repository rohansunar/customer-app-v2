/**
 * Hook for managing location data, including getting current location,
 * handling permissions, and error management.
 */

import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { useCallback, useEffect, useState } from 'react';
import {
  LocationError,
  Location as LocationType,
  LocationPermissionStatus,
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
  const [permissionStatus, setPermissionStatus] =
    useState<LocationPermissionStatus>('undetermined');

  const syncPermissionStatus = useCallback(async () => {
    const { status } = await Location.getForegroundPermissionsAsync();
    const nextStatus = status as LocationPermissionStatus;
    setPermissionStatus(nextStatus);
    return nextStatus;
  }, []);

  const getCurrentLocation = useCallback(
    async (): Promise<LocationType | null> => {
      if (loading) {
        return null;
      }

      try {
        setLoading(true);
        setError(null);

        let status = permissionStatus;
        if (status === 'undetermined') {
          status = await syncPermissionStatus();
        }

        if (status !== 'granted') {
          const result = await Location.requestForegroundPermissionsAsync();
          status = result.status as LocationPermissionStatus;
          setPermissionStatus(status);
        }

        if (status !== 'granted') {
          const permissionError: LocationError = {
            code: 'LOCATION_PERMISSION_DENIED',
            message: 'Location permission denied',
          };
          setError(permissionError);
          return null;
        }

        const servicesEnabled = await Location.hasServicesEnabledAsync();
        if (!servicesEnabled) {
          const serviceError: LocationError = {
            code: 'LOCATION_SERVICES_DISABLED',
            message: 'Location services are turned off',
          };
          setError(serviceError);
          return null;
        }

        const position = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const nextLocation: LocationType = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        setLocation(nextLocation);
        return nextLocation;
      } catch (err) {
        const locationError: LocationError = {
          code: 'LOCATION_ERROR',
          message:
            err instanceof Error ? err.message : 'Failed to get location',
        };
        setError(locationError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [loading, permissionStatus, syncPermissionStatus],
  );

  const refetch = getCurrentLocation;

  useEffect(() => {
    void syncPermissionStatus();
  }, [syncPermissionStatus]);

  const openSettings = useCallback(() => {
    void Linking.openSettings();
  }, []);

  return {
    location,
    loading,
    error,
    permissionStatus,
    refetch,
    openSettings,
  };
}
