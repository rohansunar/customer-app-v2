import { spacing } from '@/core/theme/spacing';
import { Skeleton } from '@/core/ui/Skeleton';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '@/core/theme/colors';

interface TransactionListSkeletonProps {
  count?: number;
}

/**
 * Renders animated skeleton placeholder rows while transactions are loading.
 * Uses the shared Skeleton base component for consistent pulse animation.
 */
export function TransactionListSkeleton({
  count = 5,
}: TransactionListSkeletonProps) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, i) => (
        <TransactionRowSkeleton key={`tx-skeleton-${i}`} />
      ))}
    </View>
  );
}

function TransactionRowSkeleton() {
  return (
    <View style={styles.row}>
      {/* Icon circle */}
      <Skeleton style={styles.icon} />

      {/* Text lines */}
      <View style={styles.textBlock}>
        <Skeleton style={styles.titleLine} />
        <Skeleton style={styles.dateLine} />
      </View>

      {/* Amount + badge */}
      <View style={styles.right}>
        <Skeleton style={styles.amountLine} />
        <Skeleton style={styles.badgeLine} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: spacing.s,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.m,
    borderRadius: spacing.radius.l,
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: spacing.m,
    flexShrink: 0,
  },
  textBlock: {
    flex: 1,
    gap: 6,
    marginRight: spacing.s,
  },
  titleLine: {
    height: 14,
    width: '70%',
    borderRadius: spacing.radius.s,
  },
  dateLine: {
    height: 12,
    width: '45%',
    borderRadius: spacing.radius.s,
  },
  right: {
    alignItems: 'flex-end',
    gap: 6,
  },
  amountLine: {
    height: 14,
    width: 64,
    borderRadius: spacing.radius.s,
  },
  badgeLine: {
    height: 18,
    width: 60,
    borderRadius: spacing.radius.circle,
  },
});
