import { useToastHelpers } from '@/core/utils/toastHelpers';
import { useReverseGeocode } from '@/features/map/hooks/useReverseGeocode';
import { useEffect, useRef } from 'react';
import { Address, LocationPermissionStatus } from '../address.types';

/**
 * Hook for managing geocoding logic.
 * Handles reverse geocoding and updating form fields based on results.
 */
export function useGeocodingLogic(
  lat: number,
  lng: number,
  setAddressText: (text: string) => void,
  setPincode: (text: string) => void,
  setState: (state: string) => void,
  setCity: (city: string) => void,
  permissionStatus: LocationPermissionStatus,
  currentPincode: string,
  currentState: string,
  currentCity: string,
  address?: Address,
) {
  const {
    result: geocodeResult,
    loading: geocodeLoading,
    error: geocodeError,
    reverseGeocode,
  } = useReverseGeocode();

  // Reverse geocode when coordinates change
  // Note: Debouncing is assumed to be handled by the caller or we can add it here if needed.
  // In the previous implementation, it was in useMapInteractions.
  // We will expose a trigger function or rely on effect.
  // Ideally, we listen to lat/lng changes but only if they are "stable".
  // For dragging, we might want to wait until drag ends.
  // The plan says "Debounce address reverse geocoding on drag" or "Optimize map region updates".
  // If we use onRegionChangeComplete, we get stable coordinates.

  const showToast = useToastHelpers();
  const lastGeocodedCoords = useRef({ lat: 0, lng: 0 });

  const debounceTimer = useRef<any>(null);

  useEffect(() => {
    // Movement threshold for auto-geocoding (0.0001 is ~10-15 meters)
    // Larger epsilon prevents micro-jitter from triggering redundant fetches.
    const EPSILON = 0.0001; 
    const latChanged = Math.abs(lat - lastGeocodedCoords.current.lat) > EPSILON;
    const lngChanged = Math.abs(lng - lastGeocodedCoords.current.lng) > EPSILON;

    if (
      permissionStatus === 'granted' &&
      !geocodeLoading &&
      lat !== 0 &&
      lng !== 0 &&
      (latChanged || lngChanged)
    ) {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      debounceTimer.current = setTimeout(() => {
        lastGeocodedCoords.current = { lat, lng };
        reverseGeocode(lat, lng);
      }, 800); // Slightly longer debounce for better stability
    }

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [lat, lng, reverseGeocode, geocodeLoading, permissionStatus]);

  // Show error if reverse geocoding fails
  useEffect(() => {
    if (geocodeError) {
      showToast.error(
        'Failed to get address details from map location. Please try again.',
      );
    }
  }, [geocodeError, showToast]);

  // Auto-fill address details from geocode result
  // Added guard checks to prevent redundant state updates that cause flickering/loops
  useEffect(() => {
    if (geocodeResult && !address) {
      if (geocodeResult.postalCode && geocodeResult.postalCode !== currentPincode) {
        setPincode(geocodeResult.postalCode);
      }
      if (geocodeResult.state && geocodeResult.state !== currentState) {
        setState(geocodeResult.state);
      }
      if (geocodeResult.city && geocodeResult.city !== currentCity) {
        setCity(geocodeResult.city);
      }
    }
  }, [
    geocodeResult,
    address,
    setPincode,
    setState,
    setCity,
    currentPincode,
    currentState,
    currentCity,
  ]);
  return {
    geocodeResult,
    geocodeLoading,
  };
}
