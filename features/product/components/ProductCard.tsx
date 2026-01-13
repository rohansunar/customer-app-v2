import { colors } from '@/core/theme/colors';
import { spacing } from '@/core/theme/spacing';
import { Button } from '@/core/ui/Button';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import { useAddToCart } from '@/features/cart/hooks/useAddToCart';
import { Image, StyleSheet, View } from 'react-native';
import { Product } from '../types';

type Props = {
  product: Product;
  onPress: () => void;
};

export function ProductCard({ product, onPress }: Props) {
  const addToCartMutation = useAddToCart();

  const imageUri =
    product.images && product.images.length > 0
      ? { uri: product.images[0] }
      : require('@/assets/images/product-placeholder.png');

  const handleAddToCart = () => {
    addToCartMutation.mutate({ productId: product.id, quantity: 1 });
  };

  return (
    <Card
      style={styles.card}
      onTouchEnd={onPress} // Handling press on card if needed, though Button handles cart
    >
      <View style={styles.content}>
        {/* Product Image */}
        <Image source={imageUri} style={styles.image} />

        {/* Product Info */}
        <View style={styles.info}>
          <Text variant="m" weight="semibold" numberOfLines={1}>
            {product.name}
          </Text>

          <Text variant="s" color={colors.textSecondary} style={styles.price}>
            ₹ {product.price}
          </Text>

          <Button
            title="Add"
            onPress={handleAddToCart}
            variant="primary"
            style={styles.addToCartButton}
            textStyle={{ fontSize: 12 }}
          />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.m,
    padding: spacing.s,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: spacing.radius.m,
    backgroundColor: colors.background,
  },
  info: {
    flex: 1,
    marginLeft: spacing.m,
  },
  price: {
    marginTop: spacing.xs,
    marginBottom: spacing.s,
  },
  addToCartButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.m,
    minHeight: 32,
    alignSelf: 'flex-start',
  },
});
