import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

/**
 * CartButton component for displaying the cart summary and navigation.
 */
interface CartButtonProps {
  totalItems: number;
}

export default function CartButton({ totalItems }: CartButtonProps) {
  return (
    <View style={styles.cartContainer}>
      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => router.push('/cart')}
      >
        <Text style={styles.cartText}>
          {totalItems} {totalItems === 1 ? 'item' : 'items'} added
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cartContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },

  cartButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },

  cartText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});