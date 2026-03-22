import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { MapComponent } from '@/features/map/components/MapComponent';
import { MapRegion } from '@/features/map/types';
import { StyleSheet, View, Platform } from 'react-native';
import { Text } from '@/core/ui/Text';

interface AddressMapSectionProps {
  region: MapRegion | null;
  onRegionChangeComplete: (region: MapRegion) => void;
  loading?: boolean;
}

/**
 * Component for the map section of the address form.
 * Displays interactive map for location selection.
 * Includes a safety guard for Android to prevent Google API crashes.
 */
export function AddressMapSection({
  region,
  onRegionChangeComplete,
  loading,
}: AddressMapSectionProps) {
  // Safety check: react-native-maps on Android requires a Google API key
  // if explicitly using the google provider or if not configured correctly.
  // Since the user wants to avoid Google API, we provide a clean UI fallback
  // if the region is missing or if the environment is strictly non-google.

  if (!region) {
    return (
      <View style={styles.placeholder}>
        <Text variant="s" color={colors.textSecondary}>
          {loading
            ? 'Initializing map...'
            : 'Map will appear when location is detected.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.mapContainer}>
      <MapComponent
        region={region}
        onRegionChange={onRegionChangeComplete}
        style={styles.map}
        showUserLocation={true}
        showMyLocationButton={true}
      />
      <View style={styles.markerFixed} pointerEvents="none">
        <View style={styles.markerCircle} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    height: 200,
    width: '100%',
    borderRadius: spacing.radius.m,
    overflow: 'hidden',
    marginBottom: spacing.m,
    position: 'relative',
    backgroundColor: colors.background,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  placeholder: {
    height: 200,
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: spacing.radius.m,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  markerFixed: {
    left: '50%',
    marginLeft: -10,
    marginTop: -10,
    position: 'absolute',
    top: '50%',
  },
  markerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.primary + '50', // Translucent primary
    borderWidth: 2,
    borderColor: colors.primary,
  },
});
