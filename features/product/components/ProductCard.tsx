import React, { memo, useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import { IconSymbol } from '@/core/ui/icon-symbol';
import { useDebouncedAddToCart } from '@/features/cart/hooks/useDebouncedAddToCart';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Product } from '../types';
import { DistanceBadge } from './DistanceBadge';
import { ProductImageSlider } from './ProductImageSlider';

type Props = {
  product: Product;
  /**
   * Optional callback for when item is added to cart
   * Useful for analytics or other side effects
   */
  onAddToCart?: (productId: string) => void;
};

/**
 * ProductCard component with memoization and optimized add-to-cart.
 *
 * Performance Optimizations:
 * - React.memo to prevent unnecessary re-renders when parent re-renders
 * - useCallback for event handlers to maintain referential equality
 * - useDebouncedAddToCart to prevent rapid multiple API calls
 *
 * SOLID Principles:
 * - Single Responsibility: Component focuses on product display and cart interaction
 * - Dependency Inversion: Depends on abstractions (hooks) not concrete implementations
 */
export const ProductCard = memo(function ProductCard({
  product,
  onAddToCart,
}: Props) {
  const router = useRouter();
  const addToCartMutation = useDebouncedAddToCart(500);

  // Pulse animation for urgency
  const pulseScale = useSharedValue(1);
  useEffect(() => {
    if (product.is_schedulable) {
      pulseScale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1000 }),
          withTiming(1, { duration: 1000 }),
        ),
        -1,
        true,
      );
    }
  }, [product.is_schedulable, pulseScale]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  /**
   * Memoized handler for add to cart button press
   * Prevents creating new function references on each render
   */
  const handleAddToCart = useCallback(() => {
    addToCartMutation.mutate({
      productId: product.id,
      quantity: 1,
    });

    // Optional callback for analytics or other side effects
    if (onAddToCart) {
      onAddToCart(product.id);
    }
  }, [product.id, addToCartMutation, onAddToCart]);

  /**
   * Memoized handler for subscribe button press
   */
  const handleSubscribe = useCallback(() => {
    router.push({
      pathname: '/(drawer)/home/subscriptions/create' as any,
      params: {
        productId: product.id,
        productName: product.name,
        // Calculate subscription price: use subscription_price if available, otherwise regular price
        productPrice: (product.subscription_price ?? product.price).toString(),
        productImage: product.images?.[0] || '',
        productDescription: product.description || '',
      },
    });
  }, [product, router]);

  return (
    <Card style={styles.card}>
      {/* Product Image Slider */}
      <View style={styles.sliderContainer}>
        <ProductImageSlider images={product.images || []} />
        {product.distance ? (
          <DistanceBadge
            value={product.distance.value}
            unit={product.distance.unit}
            style={styles.badge}
          />
        ) : null}
      </View>

      <View style={styles.details}>
        <View style={styles.header}>
          <Text
            variant="l"
            weight="bold"
            color={colors.textPrimary}
            style={styles.productName}
          >
            {product.name}
          </Text>
          <Text
            variant="xl"
            weight="bold"
            color={colors.primary}
            style={styles.price}
          >
            ₹ {product.price}
          </Text>
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons key={i} name="star" size={14} color="#F59E0B" />
            ))}
          </View>
          <Text
            variant="xs"
            color={colors.textSecondary}
            style={styles.ratingText}
          >
            4.8
          </Text>
        </View>

        {product.description && (
          <Text
            variant="s"
            color={colors.textSecondary}
            numberOfLines={3}
            style={styles.description}
          >
            {product.description}
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <Button
            title={addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
            onPress={handleAddToCart}
            variant="secondary"
            style={styles.cartButton}
            loading={addToCartMutation.isPending}
            disabled={addToCartMutation.isPending}
            icon={
              <IconSymbol name="cart.fill" color={colors.primary} size={20} />
            }
          />
          {product.is_schedulable && (
            <Animated.View
              style={[styles.subscribeWrapper, animatedButtonStyle]}
            >
              <TouchableOpacity
                onPress={handleSubscribe}
                activeOpacity={0.9}
                style={styles.refinedSubscribeButton}
              >
                <LinearGradient
                  colors={['#1ed3f3ff', '#fb678aff']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientContainer}
                >
                  <View style={styles.buttonInner}>
                    <Text style={styles.refinedButtonText} numberOfLines={1}>
                      Subscribe & Save @ ₹
                      {product.subscription_price || product.price}
                    </Text>
                    {product.percentageDecrease && (
                      <View style={styles.rightBadge}>
                        <Text style={styles.rightBadgeText}>
                          {product.percentageDecrease}% OFF
                        </Text>
                      </View>
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}
        </View>
      </View>
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.l,
    padding: 0, // No padding on card so slider can reach edges
    overflow: 'visible',
    borderRadius: spacing.radius.xl,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  sliderContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: spacing.m,
    right: spacing.m,
    zIndex: 10,
  },
  details: {
    padding: spacing.m,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: spacing.xxs,
  },
  productName: {
    flex: 1,
    marginRight: spacing.s,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  originalPrice: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
    marginBottom: -2,
  },
  price: {
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  stars: {
    flexDirection: 'row',
    gap: 2,
    marginRight: spacing.s,
  },
  ratingText: {
    opacity: 0.8,
  },
  description: {
    marginBottom: spacing.m,
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: spacing.s,
  },
  cartButton: {
    width: '100%',
    paddingVertical: spacing.s,
  },
  subscribeButton: {
    width: '100%',
    paddingVertical: spacing.s,
  },
  subscribeWrapper: {
    width: '100%',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  modernSubscribeButton: {
    borderRadius: spacing.radius.circle,
    overflow: 'hidden',
    height: 48, // Match standard button height
  },
  refinedSubscribeButton: {
    borderRadius: spacing.radius.circle,
    overflow: 'hidden',
    height: 48,
  },
  gradientContainer: {
    flex: 1,
    paddingHorizontal: spacing.m,
    justifyContent: 'center',
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center content
    position: 'relative',
    height: '100%',
  },
  rightBadge: {
    backgroundColor: '#FFE135',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: spacing.radius.circle,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    position: 'absolute', // Absolute to not affect centering
    right: 0,
  },
  rightBadgeText: {
    color: '#D84315',
    fontSize: 10,
    fontWeight: '900',
  },
  refinedButtonText: {
    color: colors.white,
    fontSize: 15, // Increased from 13
    fontWeight: '800',
    textAlign: 'center',
    textTransform: 'uppercase', // More modern/urgent
  },
});
