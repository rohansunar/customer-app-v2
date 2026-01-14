/**
 * Hook for reverse geocoding - converting coordinates to address information
 */

import * as Location from 'expo-location';
import { useCallback, useState } from 'react';

export interface ReverseGeocodeResult {
  formattedAddress: string;
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  district: string;
}

export interface UseReverseGeocodeReturn {
  result: ReverseGeocodeResult | null;
  loading: boolean;
  error: string | null;
  reverseGeocode: (latitude: number, longitude: number) => Promise<void>;
}

/**
 * Hook to perform reverse geocoding on coordinates
 */
export function useReverseGeocode(): UseReverseGeocodeReturn {
  const [result, setResult] = useState<ReverseGeocodeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reverseGeocode = useCallback(
    async (latitude: number, longitude: number) => {
      try {
        setLoading(true);
        setError(null);

        // Perform reverse geocoding
        const geocodeResult = await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

        if (geocodeResult && geocodeResult.length > 0) {
          const location = geocodeResult[0];

          // Build formatted address
          const addressParts = [
            location.name,
            location.street,
            location.streetNumber,
            location.district,
            location.subregion,
          ].filter(Boolean);

          const formattedAddress = addressParts.join(', ');

          const geocodeData: ReverseGeocodeResult = {
            formattedAddress: formattedAddress || 'Address not found',
            street: location.street || '',
            city: location.city || location.subregion || '',
            state: location.region || '',
            country: location.country || '',
            postalCode: location.postalCode || '',
            district: location.district || '',
          };

          setResult(geocodeData);
        } else {
          setError('No address found for these coordinates');
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to get address';
        setError(errorMessage);
        setResult(null);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    result,
    loading,
    error,
    reverseGeocode,
  };
}
