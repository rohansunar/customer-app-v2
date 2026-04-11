import * as Location from 'expo-location';
import { useCallback, useState } from 'react';

export interface ForwardGeocodeInput {
  addressText: string;
  city: string;
  state: string;
  pincode: string;
}

export interface ForwardGeocodeCoordinates {
  latitude: number;
  longitude: number;
}

export function useForwardGeocode() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const geocodeAddress = useCallback(
    async ({
      addressText,
      city,
      state,
      pincode,
    }: ForwardGeocodeInput): Promise<ForwardGeocodeCoordinates | null> => {
      const primaryQuery = [addressText, city, state, pincode]
        .map((value) => value.trim())
        .filter(Boolean)
        .join(', ');
      const fallbackQuery = [city, state, pincode]
        .map((value) => value.trim())
        .filter(Boolean)
        .join(', ');
      const queries = Array.from(
        new Set([primaryQuery, fallbackQuery].filter(Boolean)),
      );

      try {
        setLoading(true);
        setError(null);

        for (const query of queries) {
          const results = await Location.geocodeAsync(query);
          if (results.length > 0) {
            return {
              latitude: results[0].latitude,
              longitude: results[0].longitude,
            };
          }
        }

        setError('We could not match this address to a delivery location.');
        return null;
      } catch (err) {
        const nextError =
          err instanceof Error ? err.message : 'Failed to geocode the address';
        setError(nextError);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    geocodeAddress,
    loading,
    error,
  };
}
