import React from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCart } from '../hooks/useCart';
import { CartItem } from '../types';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export function CartSummary({ visible, onClose }: Props) {
  const { data, isLoading, error } = useCart();

  const cartItems = data?.cartItems || [];

  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const renderItem = ({ item }: { item: CartItem }) => {
    const imageUri =
      item.product.images && item.product.images.length > 0
        ? { uri: item.product.images[0] }
        : require('@/assets/images/product-placeholder.png');

    return (
      <View style={styles.itemContainer}>
        <Image source={imageUri} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.product.name}
          </Text>
          <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
          <Text style={styles.itemPrice}>₹ {item.price}</Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Loading cart...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.center}>
          <Text style={styles.errorText}>Error loading cart</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => Alert.alert('Retry', 'Implement retry logic')}
            accessibilityLabel="Retry loading cart"
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (cartItems.length === 0) {
      return (
        <View style={styles.center}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      );
    }

    return (
      <View style={styles.content}>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContainer}
        />
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total: ₹ {totalPrice.toFixed(2)}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.viewCartButton]}
            onPress={onClose}
            accessibilityLabel="View full cart"
          >
            <Text style={styles.viewCartText}>View Full Cart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.checkoutButton]}
            onPress={onClose}
            accessibilityLabel="Proceed to checkout"
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      accessibilityLabel="Cart summary modal"
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Cart Summary</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              accessibilityLabel="Close cart summary"
            >
              <Text style={styles.closeText}>✕</Text>
            </TouchableOpacity>
          </View>
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    minHeight: '50%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: '#666',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
    marginRight: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  itemQty: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: '#007bff',
    marginTop: 2,
  },
  totalContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  viewCartButton: {
    backgroundColor: '#e0e0e0',
  },
  viewCartText: {
    fontSize: 16,
    color: '#111',
  },
  checkoutButton: {
    backgroundColor: '#007bff',
  },
  checkoutText: {
    fontSize: 16,
    color: '#fff',
  },
});