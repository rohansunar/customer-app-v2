import { useToastHelpers } from '@/core/utils/toastHelpers';
import { useLocation } from '@/features/map/hooks/useLocation';
import { useCallback } from 'react';

/**
 * Hook for managing location logic.
 * Fetches the user's current location only after an explicit action in the address form.
 */
export function useLocationLogic(
  setLat: (lat: number) => void,
  setLng: (lng: number) => void,
) {
  const {
    loading: locationLoading,
    permissionStatus,
    refetch: refetchLocation,
    openSettings,
  } = useLocation();
  const showToast = useToastHelpers();

  const handleUseCurrentLocation = useCallback(async () => {
    const currentLocation = await refetchLocation();

    if (!currentLocation) {
      showToast.error(
        permissionStatus === 'denied'
          ? 'Location access was not granted. Enter the address manually or enable it in app settings.'
          : 'Unable to get your current location. Enter the address manually or try again.',
      );
      return false;
    }

    setLat(currentLocation.latitude);
    setLng(currentLocation.longitude);
    showToast.success('Current location set');
    return true;
  }, [permissionStatus, refetchLocation, setLat, setLng, showToast]);

  return {
    locationLoading,
    permissionStatus,
    openSettings,
    handleUseCurrentLocation,
  };
}
