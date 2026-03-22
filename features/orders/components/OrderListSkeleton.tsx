import React from 'react';
import { StyleSheet, View } from 'react-native';
import OrderCardSkeleton from './OrderCardSkeleton';
import { spacing } from '@/core/theme/spacing';

interface OrderListSkeletonProps {
  count?: number;
}

export default function OrderListSkeleton({
  count = 3,
}: OrderListSkeletonProps) {
  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <OrderCardSkeleton key={`order-skeleton-${index}`} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.m,
  },
});
