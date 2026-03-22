/**
 * Hook for managing location data, including getting current location,
 * handling permissions, and error management.
 */

import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
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
  const appState = useRef(AppState.currentState);
  const lastFetchTime = useRef(0);
  const lastLocation = useRef<LocationType | null>(null);

  const getCurrentLocation = useCallback(async (force = false) => {
    // Throttle: Don't fetch more than once every 5 seconds unless forced
    const now = Date.now();
    if (loading || (!force && now - lastFetchTime.current < 5000)) {
      return;
    }

    // Update throttle timer immediately to prevent rapid retries on failure
    lastFetchTime.current = now;

    try {
      // Lazy check: If not forced, check existing permission first to avoid loading flash
      if (!force) {
        const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
        if (existingStatus !== permissionStatus) {
            setPermissionStatus(existingStatus as LocationPermissionStatus);
        }
        if (existingStatus !== 'granted' && existingStatus !== 'undetermined') {
          // If we already know it's not granted and not undetermined, don't proceed
          return;
        }
      }

      setLoading(true);
      setError(null);

      // Request/Refresh permissions if needed
      let status = permissionStatus as any;
      if (force || status !== 'granted') {
          const result = await Location.requestForegroundPermissionsAsync();
          status = result.status;
          setPermissionStatus(status as LocationPermissionStatus);
      }

      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      // Get current position
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // High might be overkill and slower
      });

      const loc: LocationType = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };

      // Stability check: Only update if location has changed meaningfully (> 1 meter ~ 0.00001)
      const EPSILON = 0.00001; 
      const prev = lastLocation.current;
      const hasChanged = !prev || 
        Math.abs(loc.latitude - prev.latitude) > EPSILON || 
        Math.abs(loc.longitude - prev.longitude) > EPSILON;

      if (hasChanged) {
        lastLocation.current = loc;
        setLocation(loc);
      }
    } catch (err) {
      const locationError: LocationError = {
        code: 'LOCATION_ERROR',
        message: err instanceof Error ? err.message : 'Failed to get location',
      };
      setError(locationError);
    } finally {
      setLoading(false);
    }
  }, [loading, permissionStatus]);

  const refetch = getCurrentLocation;

  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        getCurrentLocation(true);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [getCurrentLocation]);

  const openSettings = useCallback(() => {
    Linking.openSettings();
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
