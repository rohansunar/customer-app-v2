/**
 * Hook for managing map logic.
 * Handles map region updates and coordinates.
 */
export function useMapLogic(
  currentLat: number,
  currentLng: number,
  setLat: (lat: number) => void,
  setLng: (lng: number) => void,
) {
  // We can maintain local map state if needed, but for now we primarily drive it via props
  // and report back changes.

  const handleMapRegionChangeComplete = (region: {
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  }) => {
    // Epsilon check to prevent micro-updates from floating point precision
    const EPSILON = 0.0001;

    const latChanged = Math.abs(region.latitude - currentLat) > EPSILON;
    const lngChanged = Math.abs(region.longitude - currentLng) > EPSILON;

    if (latChanged || lngChanged) {
      setLat(region.latitude);
      setLng(region.longitude);
    }
  };

  return {
    handleMapRegionChangeComplete,
  };
}
