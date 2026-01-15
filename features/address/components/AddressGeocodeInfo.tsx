import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AddressGeocodeInfoProps } from '../types';

/**
 * Sub-component for displaying geocoding information.
 * Shows the detected address details from reverse geocoding.
 *
 * @param geocodeResult - The geocoding result object
 * @param geocodeLoading - Loading state for geocoding
 */
export function AddressGeocodeInfo({
  geocodeResult,
  geocodeLoading,
}: AddressGeocodeInfoProps) {
  if (!geocodeResult) {
    return null;
  }

  return (
    <View style={styles.geocodeInfo}>
      {geocodeLoading && (
        <View style={styles.geocodeLoadingRow}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text
            variant="xs"
            color={colors.textSecondary}
            style={styles.loadingText}
          >
            Detecting address...
          </Text>
        </View>
      )}
      <View style={styles.geocodeRow}>
        <Ionicons name="location" size={16} color={colors.primary} />
        <Text
          variant="xs"
          color={colors.textSecondary}
          numberOfLines={2}
          style={styles.geocodeText}
        >
          {geocodeResult.formattedAddress}
        </Text>
      </View>
      {geocodeResult.city && (
        <View style={styles.geocodeRow}>
          <Ionicons name="business" size={16} color={colors.primary} />
          <Text variant="xs" color={colors.textSecondary}>
            City: {geocodeResult.city}
          </Text>
        </View>
      )}
      {geocodeResult.state && (
        <View style={styles.geocodeRow}>
          <Ionicons name="map" size={16} color={colors.primary} />
          <Text variant="xs" color={colors.textSecondary}>
            State: {geocodeResult.state}
          </Text>
        </View>
      )}
      {geocodeResult.postalCode && (
        <View style={styles.geocodeRow}>
          <Ionicons name="mail" size={16} color={colors.primary} />
          <Text variant="xs" color={colors.textSecondary}>
            Pincode: {geocodeResult.postalCode}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  geocodeInfo: {
    backgroundColor: colors.background,
    padding: spacing.m,
    borderRadius: spacing.radius.m,
    marginBottom: spacing.m,
    gap: spacing.s,
  },
  geocodeLoadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    paddingBottom: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.xs,
  },
  loadingText: {
    marginLeft: spacing.xs,
  },
  geocodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  geocodeText: {
    flex: 1,
    marginLeft: spacing.xs,
  },
});
