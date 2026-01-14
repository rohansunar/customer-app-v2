/**
 * Types for the map feature, including location data and map-related interfaces.
 */

export interface Location {
  latitude: number;
  longitude: number;
}

export interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export interface MapMarker {
  id: string;
  coordinate: Location;
  title?: string;
  description?: string;
}

export interface LocationError {
  code: string;
  message: string;
}

export interface UseLocationReturn {
  location: Location | null;
  loading: boolean;
  error: LocationError | null;
  refetch: () => void;
}
