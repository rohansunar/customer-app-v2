import { showError, showSuccess } from '@/core/ui/toast';
import { useLocation } from '@/features/map/hooks/useLocation';
import { useEffect } from 'react';
import { Address } from '../types';

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
    refetch: refetchLocation,
  } = useLocation();

  // Initialize map with current location if no address is provided and coordinates are empty
  useEffect(() => {
    if (!address && currentLocation && lat === 0 && lng === 0) {
      setLat(currentLocation.latitude);
      setLng(currentLocation.longitude);
    }
  }, [currentLocation, address, lat, lng, setLat, setLng]);

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      setLat(currentLocation.latitude);
      setLng(currentLocation.longitude);
      showSuccess('Current location set');
    } else {
      showError(
        'Unable to get current location. Please check your location permissions.',
      );
      refetchLocation();
    }
  };

  return {
    currentLocation,
    locationLoading,
    handleUseCurrentLocation,
  };
}
