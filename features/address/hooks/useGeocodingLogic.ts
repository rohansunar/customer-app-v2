import { useToastHelpers } from '@/core/utils/toastHelpers';
import { useReverseGeocode } from '@/features/map/hooks/useReverseGeocode';
import { useEffect, useRef } from 'react';
import { Address } from '../types';

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

  useEffect(() => {
    const EPSILON = 0.0001;
    const latChanged = Math.abs(lat - lastGeocodedCoords.current.lat) > EPSILON;
    const lngChanged = Math.abs(lng - lastGeocodedCoords.current.lng) > EPSILON;

    if (lat !== 0 && lng !== 0 && (latChanged || lngChanged)) {
      lastGeocodedCoords.current = { lat, lng };
      reverseGeocode(lat, lng);
    }
  }, [lat, lng, reverseGeocode]);

  // Show error if reverse geocoding fails
  useEffect(() => {
    if (geocodeError) {
      showToast.error(
        'Failed to get address details from map location. Please try again.',
      );
    }
  }, [geocodeError, showToast]);

  // Auto-fill address details from geocode result
  useEffect(() => {
    if (geocodeResult && !address) {
      setPincode(geocodeResult.postalCode);
      setState(geocodeResult.state);
      setCity(geocodeResult.city);
    }
  }, [geocodeResult, address, setPincode, setState, setCity]);

  return {
    geocodeResult,
    geocodeLoading,
  };
}
