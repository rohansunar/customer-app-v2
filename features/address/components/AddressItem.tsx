import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Address } from '../types';

/**
 * AddressItem Component
 *
 * Displays a single address in a list format with actions for edit and delete.
 * Uses React.memo for performance optimization, re-rendering only when props change.
 * Conditionally styles default addresses with primary color and checkmark.
 * Icons differentiate address types (Home/Work) for visual clarity.
 * Why memo: Prevents unnecessary re-renders in FlatList, improving scroll performance.
 * Edge cases: Handles long addresses with text truncation, default status indication.
 */
interface AddressItemProps {
  address: Address;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AddressItem = memo(
  ({ address, onPress, onEdit, onDelete }: AddressItemProps) => {
    const label = address.label?.toLowerCase() || 'other';
    const iconName =
      label === 'home'
        ? 'home-outline'
        : label === 'office'
          ? 'business-outline'
          : label === 'restaurant'
            ? 'restaurant-outline'
            : label === 'shop'
              ? 'storefront-outline'
              : label === 'institution'
                ? 'school-outline'
                : 'location-outline';

    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[
          styles.container,
          address.isDefault && styles.containerSelected, // Conditional styling for default addresses
        ]}
      >
        <View style={styles.topRow}>
          <View
            style={[
              styles.leftIcon,
              address.isDefault && styles.leftIconSelected,
            ]}
          >
            <Ionicons
              name={iconName}
              size={18}
              color={address.isDefault ? colors.surface : colors.textSecondary}
            />
          </View>

          <View style={styles.content}>
            <View style={styles.content}>
              <View style={styles.headerRow}>
                <Text weight="bold" variant="s" style={styles.title}>
                  {address.label}
                </Text>
                {address.isDefault && (
                  <View style={styles.badge}>
                    <Text variant="xs" weight="medium" style={styles.badgeText}>
                      Default
                    </Text>
                  </View>
                )}
              </View>
              <Text
                variant="xs"
                color={colors.textSecondary}
                numberOfLines={1} // Prevents overflow, shows ellipsis
                style={styles.address}
              >
                {address.address}
              </Text>
              {/* cspell:ignore pincode */}
              <Text variant="xs" color={colors.textTertiary}>
                {address.location?.name}, {address.pincode}
              </Text>
            </View>
          </View>

          <View style={styles.rightActions}>
            {address.isDefault && (
              <View style={styles.checkWrap}>
                <Ionicons name="checkmark" size={12} color={colors.surface} />
              </View>
            )}
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <Ionicons name="pencil-outline" size={16} color={colors.info} />
            <Text
              variant="s"
              weight="medium"
              style={styles.actionTextPrimary}
            >
              Edit
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.deleteButton}>
            <Ionicons name="trash-outline" size={16} color={colors.error} />
            <Text variant="s" weight="medium" style={styles.actionTextDanger}>
              Delete
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  },
);

AddressItem.displayName = 'AddressItem';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.l,
    padding: spacing.ms,
    marginBottom: spacing.s,
    borderWidth: 2,
    borderColor: colors.border,
  },
  containerSelected: {
    borderColor: colors.info,
    backgroundColor: colors.info + '0D', // Light tint
  },
  leftIcon: {
    width: 34,
    height: 34,
    borderRadius: spacing.radius.m,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.border + '60',
    marginRight: spacing.ms,
  },
  leftIconSelected: {
    backgroundColor: colors.info,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
  },
  title: {
    color: colors.textPrimary,
    textTransform: 'capitalize',
  },
  badge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 1,
    borderRadius: spacing.radius.s,
    backgroundColor: colors.success + '20',
  },
  badgeText: {
    color: colors.success,
  },
  address: {
    marginTop: 1.5,
  },
  rightActions: {
    marginLeft: spacing.s,
  },
  checkWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.info,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionsRow: {
    width: '100%',
    flexDirection: 'row',
    gap: spacing.s,
    marginTop: spacing.ms,
    paddingTop: spacing.ms,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.s,
    borderRadius: spacing.radius.m,
    backgroundColor: colors.info + '0F',
  },
  deleteButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.s,
    borderRadius: spacing.radius.m,
    backgroundColor: colors.error + '0F',
  },
  actionTextPrimary: {
    color: colors.info,
  },
  actionTextDanger: {
    color: colors.error,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

