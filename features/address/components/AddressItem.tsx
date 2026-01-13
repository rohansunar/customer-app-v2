import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Address } from '../types';

interface AddressItemProps {
  address: Address;
  onPress: () => void;
  onDelete?: () => void;
  onToggleDefault?: () => void;
}

export function AddressItem({
  address,
  onPress,
  onDelete,
  onToggleDefault,
}: AddressItemProps) {
  const displayLabel = address.isDefault
    ? `${address.label} (Primary)`
    : address.label;

  return (
    <Card
      style={styles.container}
      onTouchEnd={onPress}
      accessible={true}
      accessibilityLabel={`Address: ${displayLabel}, ${address.address}, ${address.city.name}, ${address.pincode}`}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text weight="semibold" variant="m">
            {displayLabel}
          </Text>
          <Text variant="s" color={colors.textSecondary} style={styles.address}>
            {address.address}
          </Text>
          <Text variant="s" color={colors.textTertiary} style={styles.details}>
            {address.city.name}, {address.pincode}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Ionicons name="location-outline" size={20} color={colors.primary} />
          {onToggleDefault && (
            <TouchableOpacity
              onPress={onToggleDefault}
              style={styles.toggleButton}
            >
              <Ionicons
                name={address.isDefault ? 'star' : 'star-outline'}
                size={20}
                color={address.isDefault ? colors.warning : colors.textTertiary}
              />
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
              <Ionicons name="trash-outline" size={20} color={colors.error} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.m,
    marginVertical: spacing.s,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.m,
  },
  address: {
    marginTop: spacing.xs,
  },
  details: {
    marginTop: 2,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: spacing.m,
  },
  toggleButton: {
    marginLeft: spacing.m,
  },
});
