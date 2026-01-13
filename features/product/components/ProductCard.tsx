import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import { useAddToCart } from '@/features/cart/hooks/useAddToCart';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Product } from '../types';
import { ProductImageSlider } from './ProductImageSlider';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const addToCartMutation = useAddToCart();

  const handleAddToCart = () => {
    addToCartMutation.mutate({ productId: product.id, quantity: 1 });
  };

  return (
    <Card style={styles.card}>
      {/* Product Image Slider */}
      <ProductImageSlider images={product.images || []} />

      <View style={styles.details}>
        <View style={styles.header}>
          <Text variant="l" weight="bold" color={colors.textPrimary}>
            {product.name}
          </Text>
          <Text variant="m" weight="bold" color={colors.primary}>
            ₹ {product.price}
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

        <Button
          title={addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
          onPress={handleAddToCart}
          variant="primary"
          style={styles.addButton}
          loading={addToCartMutation.isPending}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.l,
    padding: 0, // No padding on card so slider can reach edges
    overflow: 'hidden',
    borderRadius: spacing.radius.l,
    backgroundColor: colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  addButton: {
    width: '100%',
    height: 52,
    borderRadius: spacing.radius.m,
    paddingHorizontal: spacing.m,
  },
});
