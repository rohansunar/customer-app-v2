import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { AddressTabsProps } from '../types';

/**
 * Sub-component for rendering address type tabs (Home, Office, etc.).
 * Allows user to select the label for the address.
 *
 * @param label - Currently selected label
 * @param onLabelChange - Callback for label changes
 */
export function AddressTabs({ label, onLabelChange }: AddressTabsProps) {
  const addressTypes = ['Home', 'Office', 'Restaurant', 'Shop', 'Institution'];

  return (
    <>
      <Text variant="s" color={colors.textSecondary} style={styles.label}>
        Save address as
      </Text>
      <View style={styles.tabsContainer}>
        {addressTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[styles.tab, label === type && styles.activeTab]}
            onPress={() => onLabelChange(type)}
          >
            <Text
              variant="xs"
              weight={label === type ? 'bold' : 'medium'}
              color={label === type ? colors.white : colors.textSecondary}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: spacing.xs,
  },
  tabsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.m,
    gap: spacing.s,
  },
  tab: {
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
    borderRadius: spacing.radius.circle,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  activeTab: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
