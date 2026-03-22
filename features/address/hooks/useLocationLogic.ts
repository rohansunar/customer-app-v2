import { useToastHelpers } from '@/core/utils/toastHelpers';
import { useLocation } from '@/features/map/hooks/useLocation';
import { useEffect } from 'react';
import { Address } from '../address.types';

/**
 * Hook for managing location logic.
 * Handles initialization of coordinates from current location or existing address.
 */
export function useLocationLogic(
  lat: number,
  lng: number,
  setLat: (lat: number) => void,
  setLng: (lng: number) => void,
  address?: Address,
) {
  const {
    location: currentLocation,
    loading: locationLoading,
    permissionStatus,
    refetch: refetchLocation,
    openSettings,
  } = useLocation();
  const showToast = useToastHelpers();

  // Initialize map with current location if no address is provided and coordinates are empty
  useEffect(() => {
    if (!address && currentLocation && lat === 0 && lng === 0) {
      // Small epsilon check even for the initial set to be absolutely safe
      const EPSILON = 0.00001;
      const isMeaningful =
        Math.abs(currentLocation.latitude) > EPSILON ||
        Math.abs(currentLocation.longitude) > EPSILON;

      if (isMeaningful) {
        if (Math.abs(currentLocation.latitude - lat) > EPSILON) {
          setLat(currentLocation.latitude);
        }
        if (Math.abs(currentLocation.longitude - lng) > EPSILON) {
          setLng(currentLocation.longitude);
        }
      }
    }
  }, [currentLocation, address, lat, lng, setLat, setLng]);

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      setLat(currentLocation.latitude);
      setLng(currentLocation.longitude);
      showToast.success('Current location set');
    } else {
      showToast.error(
        'Unable to get current location. Please check your location permissions.',
      );
      // Passing true to force a fresh fetch regardless of throttle
      (refetchLocation as any)(true);
    }
  };

  return {
    currentLocation,
    locationLoading,
    permissionStatus,
    refetchLocation,
    openSettings,
    handleUseCurrentLocation,
  };
}
