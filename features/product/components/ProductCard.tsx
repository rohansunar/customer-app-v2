import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Product } from '../types';

type Props = {
  product: Product;
  onPress: () => void;
};

export function ProductCard({ product, onPress }: Props) {
  const imageUri =
    product.images && product.images.length > 0
      ? { uri: product.images[0] }
      : require('@/assets/images/product-placeholder.png');

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

        {/* STATUS */}
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor: product.is_active ? '#E6F4EA' : '#FDECEC',
            },
          ]}
        >
          <Text style={[styles.statusText, { color: product.is_active ? '#34C759' : '#FF3B30' }]}>
            {product.is_active ? 'Active' : 'Inactive'}
          </Text>
        </View>
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
  statusBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
