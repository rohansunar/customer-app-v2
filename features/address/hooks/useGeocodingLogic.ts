import { useToastHelpers } from '@/core/utils/toastHelpers';
import { useReverseGeocode } from '@/features/map/hooks/useReverseGeocode';
import { useEffect, useRef } from 'react';
import { Address } from '../address.types';

/**
 * useGeocodingLogic Hook
 *
 * Handles reverse geocoding (coordinates -> address details).
 * Auto-fills form fields when coordinates change (unless user already edited them).
 *
 * Behavior:
 * - Watches lat/lng changes and triggers reverse geocode after 800ms debounce
 * - Only fills fields user hasn't manually modified (check dirty flags)
 * - Shows toast if geocoding fails
 *
 * @param lat, lng - Current coordinates
 * @param setPincode, setState, setCity - Setters for form fields
 * @param currentPincode, currentState, currentCity - Current field values (for diff check)
 * @param address - Existing address for edit mode
 * @param pincodeDirty, cityDirty, stateDirty - Flags indicating user modified field
 */
export function useGeocodingLogic(
  lat: number,
  lng: number,
  setPincode: (text: string) => void,
  setState: (state: string) => void,
  setCity: (city: string) => void,
  currentPincode: string,
  currentState: string,
  currentCity: string,
  address?: Address,
  pincodeDirty?: boolean,
  cityDirty?: boolean,
  stateDirty?: boolean,
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
  const lastGeocodedCoords = useRef({
    lat: address?.lat || 0,
    lng: address?.lng || 0,
  });

  const debounceTimer = useRef<any>(null);

  useEffect(() => {
    const EPSILON = 0.0001;
    const latChanged = Math.abs(lat - lastGeocodedCoords.current.lat) > EPSILON;
    const lngChanged = Math.abs(lng - lastGeocodedCoords.current.lng) > EPSILON;

    if (
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
  }, [lat, lng, reverseGeocode, geocodeLoading]);

  // Show error if reverse geocoding fails
  useEffect(() => {
    if (geocodeError) {
      showToast.error(
        'Failed to get address details from map location. Please try again.',
      );
    }
  }, [geocodeError, showToast]);

  // Auto-fill address details from geocode result
  // Only auto-fill fields that haven't been manually modified by the user
  useEffect(() => {
    if (geocodeResult) {
      if (
        geocodeResult.postalCode &&
        geocodeResult.postalCode !== currentPincode &&
        !pincodeDirty
      ) {
        setPincode(geocodeResult.postalCode);
      }
      if (
        geocodeResult.state &&
        geocodeResult.state !== currentState &&
        !stateDirty
      ) {
        setState(geocodeResult.state);
      }
      if (
        geocodeResult.city &&
        geocodeResult.city !== currentCity &&
        !cityDirty
      ) {
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
    pincodeDirty,
    cityDirty,
    stateDirty,
  ]);
  return {
    geocodeResult,
    geocodeLoading,
  };
}
