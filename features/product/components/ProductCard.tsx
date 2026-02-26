import React, { memo, useCallback, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useDebouncedAddToCart } from '@/features/cart/hooks/useDebouncedAddToCart';
import { useRouter } from 'expo-router';
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
        productPrice: product.price.toString(),
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
          <Text variant="l" weight="bold" color={colors.primary}>
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
            4.8 (1.2k reviews) • 2k+ bought
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
            <Button
              title="Subscribe & Save"
              onPress={handleSubscribe}
              variant="primary"
              style={styles.subscribeButton}
              textStyle={styles.subscribeText}
              icon={
                <IconSymbol
                  name="arrow.clockwise"
                  color={colors.surface}
                  size={20}
                />
              }
            />
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
    flexDirection: 'row',
    gap: spacing.s,
  },
  cartButton: {
    flex: 1,
    paddingVertical: spacing.s,
  },
  subscribeButton: {
    flex: 1,
    paddingVertical: spacing.s,
  },
  subscribeText: {
    color: colors.surface,
    fontSize: 14,
  },
});
