import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { MapComponent } from '@/features/map/components/MapComponent';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AddressMapSectionProps } from '../types';

/**
 * Sub-component for rendering the map section of the address form.
 * Displays the map with location marker and drag instruction overlay.
 *
 * @param lat - Latitude for map center
 * @param lng - Longitude for map center
 * @param onRegionChange - Callback for map region changes
 */
export function AddressMapSection({ lat, lng, onRegionChange }: AddressMapSectionProps) {
  const hasValidCoordinates = lat !== 0 && lng !== 0;

  if (!hasValidCoordinates) {
    return null;
  }

  return (
    <View style={styles.mapContainer}>
      <MapComponent
        region={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onRegionChange={onRegionChange}
        height={250}
      />
      <View style={styles.mapOverlay}>
        <Ionicons name="location-sharp" size={40} color={colors.error} />
      </View>
      <View style={styles.mapInfoOverlay}>
        <Text variant="xs" color={colors.white} weight="medium">
          Drag map to select location
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 250,
    marginBottom: spacing.m,
    borderRadius: spacing.radius.m,
    overflow: 'hidden',
    position: 'relative',
  },
  mapOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -40,
    pointerEvents: 'none',
  },
  mapInfoOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});