import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Address } from '../types';

interface AddressItemProps {
  address: Address;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const AddressItem = memo(
  ({ address, onPress, onEdit, onDelete }: AddressItemProps) => {
    return (
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[
          styles.container,
          address.isDefault && styles.containerSelected,
        ]}
      >
        <View style={styles.leftIcon}>
          <Ionicons
            name={
              address.label.toLowerCase() === 'home'
                ? 'home-outline'
                : 'business-outline'
            }
            size={20}
            color={address.isDefault ? colors.primary : colors.textSecondary}
          />
        </View>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text
              weight="bold"
              variant="s"
              color={address.isDefault ? colors.primary : colors.textPrimary}
            >
              {address.label}
              {address.isDefault && ' (Default)'}
            </Text>
          </View>
          <Text
            variant="xs"
            color={colors.textSecondary}
            numberOfLines={1}
            style={styles.address}
          >
            {address.address}
          </Text>
          <Text variant="xs" color={colors.textTertiary}>
            {address.location.name}, {address.pincode}
          </Text>
        </View>

        <View style={styles.rightActions}>
          {address.isDefault && (
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={colors.primary}
              style={styles.checkIcon}
            />
          )}
          <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
            <Ionicons
              name="pencil-outline"
              size={18}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
            <Ionicons name="trash-outline" size={18} color={colors.error} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.m,
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.l,
    marginBottom: spacing.m,
    borderWidth: 1,
    borderColor: colors.border,
  },
  containerSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '08', // Light tint
  },
  leftIcon: {
    marginRight: spacing.m,
    width: 32,
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  address: {
    marginTop: 2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: spacing.s,
  },
  actionButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
  checkIcon: {
    marginRight: spacing.xs,
  },
});
