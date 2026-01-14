import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { AddressCoordinatesDisplayProps } from '../types';

/**
 * Sub-component for displaying the selected coordinates.
 * Shows latitude and longitude values.
 *
 * @param lat - Latitude value
 * @param lng - Longitude value
 */
export function AddressCoordinatesDisplay({ lat, lng }: AddressCoordinatesDisplayProps) {
  const hasValidCoordinates = lat !== 0 && lng !== 0;

  if (!hasValidCoordinates) {
    return null;
  }

  return (
    <View style={styles.coordinatesContainer}>
      <View style={styles.coordinateRow}>
        <Ionicons name="location" size={16} color={colors.primary} />
        <Text
          variant="s"
          color={colors.textSecondary}
          style={styles.coordinateLabel}
        >
          Latitude:
        </Text>
        <Text variant="s" weight="medium">
          {lat.toFixed(4)}
        </Text>
      </View>
      <View style={styles.coordinateRow}>
        <Ionicons name="location" size={16} color={colors.primary} />
        <Text
          variant="s"
          color={colors.textSecondary}
          style={styles.coordinateLabel}
        >
          Longitude:
        </Text>
        <Text variant="s" weight="medium">
          {lng.toFixed(4)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  coordinatesContainer: {
    backgroundColor: colors.background,
    padding: spacing.m,
    borderRadius: spacing.radius.m,
    marginBottom: spacing.m,
    gap: spacing.s,
  },
  coordinateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  coordinateLabel: {
    marginLeft: spacing.xs,
  },
});