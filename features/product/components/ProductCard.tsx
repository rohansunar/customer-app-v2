import { useAddToCart } from '@/features/cart/hooks/useAddToCart';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Product Image */}
      <Image source={imageUri} style={styles.image} />

      {/* Product Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>

        <Text style={styles.price}>₹ {product.price}</Text>

        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  disabledCard: {
    opacity: 0.5,
  },
  disabledText: {
    textDecorationLine: 'line-through',
    color: '#6B7280',
  },
  image: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    color: '#555',
  },
  addToCartButton: {
    marginTop: 8,
    backgroundColor: '#007bff',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
