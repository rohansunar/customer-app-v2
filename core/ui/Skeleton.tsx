import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

interface SkeletonProps {
  style?: StyleProp<ViewStyle>;
}

export function Skeleton({ style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.55)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.55,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    pulse.start();
    return () => pulse.stop();
  }, [opacity]);

  return <Animated.View style={[styles.base, style, { opacity }]} />;
}

export function ProductCardSkeleton() {
  return (
    <View style={styles.productCard}>
      <Skeleton style={styles.productImage} />

      <View style={styles.productContent}>
        <Skeleton style={styles.productTitle} />
        <View style={styles.metaRow}>
          <Skeleton style={styles.metaSm} />
          <Skeleton style={styles.metaSm} />
          <Skeleton style={styles.metaMd} />
        </View>
        <Skeleton style={styles.productSubText} />
        <View style={styles.bottomRow}>
          <Skeleton style={styles.pricePill} />
          <Skeleton style={styles.actionButton} />
        </View>
      </View>
    </View>
  );
}

interface ProductListSkeletonProps {
  count?: number;
}

export function ProductListSkeleton({ count = 4 }: ProductListSkeletonProps) {
  return (
    <View style={styles.list}>
      {Array.from({ length: count }).map((_, index) => (
        <ProductCardSkeleton key={`product-skeleton-${index}`} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: colors.accent,
    borderRadius: spacing.radius.m,
  },
  list: {
    gap: spacing.m,
  },
  productCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 192,
    borderRadius: 0,
  },
  productContent: {
    padding: spacing.m,
    gap: 12,
  },
  productTitle: {
    height: 20,
    width: '75%',
  },
  metaRow: {
    flexDirection: 'row',
    gap: spacing.s,
  },
  metaSm: {
    height: 16,
    width: 48,
  },
  metaMd: {
    height: 16,
    width: 64,
  },
  productSubText: {
    height: 16,
    width: '50%',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pricePill: {
    height: 32,
    width: 80,
  },
  actionButton: {
    height: 44,
    width: 96,
    borderRadius: spacing.radius.l,
  },
});
