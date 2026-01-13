import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Text } from '@/core/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

interface CartButtonProps {
  totalItems: number;
}

export default function CartButton({ totalItems }: CartButtonProps) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (totalItems > 0) {
      // Pop animation
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.1,
          useNativeDriver: true,
          speed: 20,
          bounciness: 12,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
        }),
      ]).start();
    }
  }, [totalItems]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.cartBar}
        onPress={() => router.push('/home/cart' as any)}
        activeOpacity={0.8}
      >
        <View style={styles.leftContent}>
          <View style={styles.badge}>
            <Text variant="s" color={colors.white} weight="bold">
              {totalItems}
            </Text>
          </View>
          <Text variant="m" color={colors.white} weight="semibold">
            {totalItems === 1 ? 'Item' : 'Items'} added
          </Text>
        </View>

        <View style={styles.rightContent}>
          <Text variant="m" color={colors.white} weight="bold">
            View Cart
          </Text>
          <Ionicons
            name="arrow-forward"
            size={18}
            color={colors.white}
            style={styles.icon}
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: spacing.m,
    left: spacing.m,
    right: spacing.m,
    zIndex: 100,
  },
  cartBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: spacing.radius.xl,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: spacing.radius.s,
    paddingHorizontal: spacing.s,
    paddingVertical: 2,
    marginRight: spacing.s,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: spacing.xs,
  },
});
