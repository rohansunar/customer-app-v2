import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import { useAddToCart } from '@/features/cart/hooks/useAddToCart';
import { SubscriptionModal } from '@/features/subscriptions/components/SubscriptionModal';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Product } from '../types';
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

        <View style={styles.additionalInfo}>
          <Text variant="s" color={colors.textSecondary}>
           <Ionicons name="location" size={16} color={colors.black} /> {product.distance.value} {product.distance.unit} away
          </Text>
          <Text variant="s" color={colors.textSecondary}>
            Bought by 300+
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title={addToCartMutation.isPending ? 'Adding...' : 'Add to Cart'}
            onPress={handleAddToCart}
            variant="outline"
            style={styles.cartButton}
            loading={addToCartMutation.isPending}
          />
          <Button
            title="Subscribe"
            onPress={() => setIsSubscriptionModalVisible(true)}
            variant="primary"
            style={styles.subscribeButton}
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
