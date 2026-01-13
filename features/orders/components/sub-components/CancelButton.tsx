import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface CancelButtonProps {
  onPress: () => void;
}

export default function CancelButton({ onPress }: CancelButtonProps) {
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={onPress}
      activeOpacity={0.7}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel="Cancel order"
      accessibilityHint="Opens a modal to select cancellation reason"
    >
      <Text variant="s" weight="bold" color={colors.surface}>
        Cancel Order
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: spacing.m,
    backgroundColor: colors.error,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.s,
    borderRadius: spacing.radius.m,
    alignSelf: 'flex-start',
    shadowColor: colors.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
});
