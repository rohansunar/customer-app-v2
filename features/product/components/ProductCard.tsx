import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAddToCart } from '@/features/cart/hooks/useAddToCart';
import { SubscriptionModal } from '@/features/subscriptions/components/SubscriptionModal';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Product } from '../types';
import { DistanceBadge } from './DistanceBadge';
import { ProductImageSlider } from './ProductImageSlider';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const [isSubscriptionModalVisible, setIsSubscriptionModalVisible] =
    useState(false);
  const addToCartMutation = useAddToCart();

  const handleAddToCart = () => {
    addToCartMutation.mutate({ productId: product.id, quantity: 1 });
  };

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
          <Text variant="l" weight="bold" color={colors.textPrimary}>
            {product.name}
          </Text>
          <Text variant="s" color={colors.textSecondary}>
            Bought by 300+
          </Text>
        </View>

        {product.description && (
          <Text
            variant="s"
            color={colors.textSecondary}
            numberOfLines={2}
            style={styles.description}
          >
            {product.description}
          </Text>
        )}

        <View style={styles.additionalInfo}>
          <Text variant="l" weight="semibold" color={colors.textPrimary}>
            ₹ {product.price}
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
            onPress={handleAddToCart}
            variant="outline"
            style={styles.cartButton}
            loading={addToCartMutation.isPending}
            icon={
              <IconSymbol name="cart.fill" color={colors.primary} size={20} />
            }
          />
          <Button
            title="Subscribe"
            onPress={() => setIsSubscriptionModalVisible(true)}
            variant="primary"
            style={styles.subscribeButton}
            icon={
              <IconSymbol
                name="arrow.clockwise"
                color={colors.surface}
                size={20}
              />
            }
          />
        </View>
      </View>

      <SubscriptionModal
        visible={isSubscriptionModalVisible}
        onClose={() => setIsSubscriptionModalVisible(false)}
        productId={product.id}
        productName={product.name}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.l,
    padding: 0, // No padding on card so slider can reach edges
    overflow: 'visible',
    borderRadius: spacing.radius.l,
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
    marginBottom: spacing.xs,
  },
  description: {
    marginBottom: spacing.m,
    lineHeight: 20,
  },
  additionalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
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
});
