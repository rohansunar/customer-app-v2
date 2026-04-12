import { useToastHelpers } from '@/core/utils/toastHelpers';
import { useLocation } from '@/features/map/hooks/useLocation';
import { useCallback } from 'react';

/**
 * useLocationLogic Hook
 *
 * Manages location fetching for address form.
 * Provides both manual trigger (button press) and auto-trigger (form open) functions.
 *
 * Permission states: 'undetermined', 'granted', 'denied'
 * Handles the "Open App Settings" flow for denied permissions.
 *
 * @param setLat, setLng - Form state setters for coordinates
 *
 * Returns:
 * - locationLoading: Loading state for location fetch
 * - permissionStatus: Current permission state
 * - openSettings: Open device settings (for denied state)
 * - handleUseCurrentLocation: Button click handler (with toast feedback)
 * - fetchLocation: Silent fetch for auto-fill (no toast)
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

  const fetchLocation = useCallback(async () => {
    const currentLocation = await refetchLocation();
    if (currentLocation) {
      setLat(currentLocation.latitude);
      setLng(currentLocation.longitude);
      return true;
    }
    return false;
  }, [refetchLocation, setLat, setLng]);

  return {
    locationLoading,
    permissionStatus,
    openSettings,
    handleUseCurrentLocation,
    fetchLocation,
  };
}
