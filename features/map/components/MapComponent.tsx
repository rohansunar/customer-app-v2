/**
 * MapComponent for displaying an interactive map with markers.
 * Integrates with react-native-maps for rendering and state management.
 */

import { colors } from '@/core/theme/colors';
import { Text } from '@/core/ui/Text';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { MapMarker, MapRegion } from '../types';

interface MapComponentProps {
  region?: MapRegion;
  markers?: MapMarker[];
  onRegionChange?: (region: MapRegion) => void;
  onMarkerPress?: (marker: MapMarker) => void;
  style?: any;
  height?: number;
  showUserLocation?: boolean;
  showMyLocationButton?: boolean;
}

/**
 * Component to render a map with optional markers and region handling.
 */
export function MapComponent({
  region,
  markers = [],
  onRegionChange,
  onMarkerPress,
  style,
  height = 300,
  showUserLocation = true,
  showMyLocationButton = true,
}: MapComponentProps) {
  const handleRegionChange = (newRegion: Region) => {
    if (onRegionChange) {
      const mapRegion: MapRegion = {
        latitude: newRegion.latitude,
        longitude: newRegion.longitude,
        latitudeDelta: newRegion.latitudeDelta,
        longitudeDelta: newRegion.longitudeDelta,
      };
      onRegionChange(mapRegion);
    }
  };

  const handleMarkerPress = (markerData: any) => {
    const marker = markers.find((m) => m.id === markerData.id);
    if (marker && onMarkerPress) {
      onMarkerPress(marker);
    }
  };

  if (!region) {
    return (
      <View style={[styles.container, style]}>
        <Text variant="m" color={colors.textSecondary}>
          Map region not provided
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        region={region}
        onRegionChangeComplete={handleRegionChange}
        showsUserLocation={showUserLocation}
        showsMyLocationButton={showMyLocationButton}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.coordinate.latitude,
              longitude: marker.coordinate.longitude,
            }}
            title={marker.title}
            description={marker.description}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
