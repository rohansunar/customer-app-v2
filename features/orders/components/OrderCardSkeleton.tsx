import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Skeleton } from '@/core/ui/Skeleton';
import { spacing } from '@/core/theme/spacing';
import { colors } from '@/core/theme/colors';

export default function OrderCardSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header skeleton */}
        <View style={styles.header}>
          <Skeleton style={styles.title} />
          <View style={styles.dateContainer}>
            <Skeleton style={styles.date} />
            <Skeleton style={styles.time} />
          </View>
        </View>

        {/* Price skeleton */}
        <Skeleton style={styles.price} />

        {/* Status skeleton */}
        <Skeleton style={styles.status} />

        {/* OTP skeleton */}
        <Skeleton style={styles.otp} />

        {/* Action button skeleton */}
        <Skeleton style={styles.actionButton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: spacing.radius.l,
    padding: spacing.m,
    marginBottom: spacing.m,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xs,
  },
  title: {
    height: 16,
    width: 120,
  },
  dateContainer: {
    alignItems: 'flex-end',
  },
  date: {
    height: 12,
    width: 60,
    marginBottom: 4,
  },
  time: {
    height: 12,
    width: 50,
  },
  price: {
    height: 14,
    width: 100,
    marginTop: spacing.xs,
  },
  status: {
    height: 20,
    width: 80,
    borderRadius: 8,
    marginTop: spacing.s,
  },
  otp: {
    height: 16,
    width: 120,
    marginTop: spacing.s,
  },
  actionButton: {
    height: 36,
    width: 100,
    borderRadius: spacing.radius.m,
    marginTop: spacing.m,
  },
});

