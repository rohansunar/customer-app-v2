import { showSuccess } from '@/core/ui/toast';
import { useLocation } from '@/features/map/hooks/useLocation';
import { useReverseGeocode } from '@/features/map/hooks/useReverseGeocode';
import { useEffect } from 'react';
import { Address } from '../types';

/**
 * Custom hook for managing map interactions, location services, and geocoding.
 * Handles current location retrieval, reverse geocoding, and map region changes.
 *
 * @param lat - Current latitude
 * @param lng - Current longitude
 * @param setLat - Setter for latitude
 * @param setLng - Setter for longitude
 * @param setAddressText - Setter for address text
 * @param setPincode - Setter for pincode
 * @param setState - Setter for state
 * @param address - Optional existing address (for edit mode)
 * @param addressText - Current address text
 * @param pincode - Current pincode
 * @returns Object containing location data, geocode result, and handlers
 */
export function useMapInteractions(
  lat: number,
  lng: number,
  setLat: (lat: number) => void,
  setLng: (lng: number) => void,
  setAddressText: (text: string) => void,
  setPincode: (text: string) => void,
  setState: (state: string) => void,
  address?: Address,
  addressText?: string,
  pincode?: string
) {
  const {
    location: currentLocation,
    loading: locationLoading,
    refetch: refetchLocation,
  } = useLocation();
  const {
    result: geocodeResult,
    loading: geocodeLoading,
    reverseGeocode,
  } = useReverseGeocode();

  // Initialize map with current location or saved location
  useEffect(() => {
    if (!address && currentLocation && lat === 0 && lng === 0) {
      setLat(currentLocation.latitude);
      setLng(currentLocation.longitude);
    }
  }, [currentLocation, address, lat, lng, setLat, setLng]);

  // Reverse geocode when coordinates change (with debouncing)
  useEffect(() => {
    if (lat !== 0 && lng !== 0) {
      const timeoutId = setTimeout(() => {
        reverseGeocode(lat, lng);
      }, 800);
      return () => clearTimeout(timeoutId);
    }
  }, [lat, lng, reverseGeocode]);

  // Auto-fill address details from geocode result
  useEffect(() => {
    if (geocodeResult && !address) {
      if (geocodeResult.formattedAddress && !addressText) {
        setAddressText(geocodeResult.formattedAddress);
      }
      if (geocodeResult.postalCode && !pincode) {
        setPincode(geocodeResult.postalCode);
      }
      if (geocodeResult.state) {
        setState(geocodeResult.state);
      }
    }
  }, [geocodeResult, address, addressText, pincode, setAddressText, setPincode, setState]);

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      setLat(currentLocation.latitude);
      setLng(currentLocation.longitude);
      showSuccess('Current location set');
    } else {
      refetchLocation();
    }
  };

  const handleMapRegionChange = (region: any) => {
    setLat(region.latitude);
    setLng(region.longitude);
  };

  const handleFillFromMap = () => {
    if (geocodeResult) {
      if (geocodeResult.formattedAddress) {
        setAddressText(geocodeResult.formattedAddress);
      }
      if (geocodeResult.postalCode) {
        setPincode(geocodeResult.postalCode);
      }
      showSuccess('Address details filled from map location');
    }
  };

  return {
    currentLocation,
    locationLoading,
    geocodeResult,
    geocodeLoading,
    handleUseCurrentLocation,
    handleMapRegionChange,
    handleFillFromMap,
  };
}