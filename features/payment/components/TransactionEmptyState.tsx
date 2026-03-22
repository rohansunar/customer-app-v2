import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { IconSymbol } from '@/core/ui/icon-symbol';
import React from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * Displayed when the transaction list is empty.
 * Shows an icon, headline, and explanatory sub-text.
 */
export function TransactionEmptyState() {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <IconSymbol
          name="creditcard.fill"
          size={36}
          color={colors.primary + '80'}
        />
      </View>
      <Text weight="bold" variant="m" style={styles.title}>
        No Transactions Yet
      </Text>
      <Text variant="s" color={colors.textSecondary} style={styles.subtitle}>
        Your wallet transactions will appear here once you make a top-up or
        place an order.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.l,
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.l,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  iconWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary + '10',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  title: {
    marginBottom: spacing.s,
    color: colors.textPrimary,
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 20,
  },
});
