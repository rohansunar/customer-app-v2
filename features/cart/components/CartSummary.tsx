import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useCart } from '../hooks/useCart';
import { useRemoveFromCart } from '../hooks/useRemoveFromCart';
import { CartItem } from '../types';

export function CartSummary() {
  const { data, isLoading, error } = useCart();
  const removeFromCart = useRemoveFromCart();

  const cartItems = data?.cartItems || [];

  const renderItem = useCallback(({ item }: { item: CartItem }) => {
    const imageUri =
      item.images && item.images.length > 0
        ? { uri: item.images[0] }
        : require('@/assets/images/product-placeholder.png');

    return (
      <View style={styles.itemContainer}>
        <Image source={imageUri} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
          <Text style={styles.itemPrice}>Price: ₹ {item.price}</Text>
          {item.deposit && <Text style={styles.itemDeposit}>Deposit: ₹ {item.deposit}</Text>}
          <Text style={styles.itemTotalPrice}>Total: ₹ {item.totalPrice}</Text>
        </View>
        <TouchableOpacity
          onPress={() => removeFromCart.mutate(item.id)}
          style={styles.deleteButton}
          accessibilityLabel="Delete item"
          accessibilityRole="button"
          accessibilityHint="Removes this item from the cart"
        >
          <Ionicons name="trash" size={18} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    );
  }, [removeFromCart.mutate]);

  // Loading state view
  const renderLoadingView = (): React.ReactElement => (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#007bff" />
      <Text style={styles.loadingText}>Loading cart...</Text>
    </View>
  );

  // Empty cart state view
  const renderEmptyView = (): React.ReactElement => (
    <View style={styles.center}>
      <Text style={styles.emptyText}>Your cart is empty</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => router.push('/dashboard')}
        accessibilityLabel="Go to Products"
        accessibilityRole="button"
        accessibilityHint="Navigates to the products page"
      >
        <Text style={styles.retryText}>Go to Products</Text>
      </TouchableOpacity>
    </View>
  );

  // Error state view
  const renderErrorView = (): React.ReactElement => (
    <View style={styles.center}>
      <Text style={styles.errorText}>Error loading cart</Text>
      <TouchableOpacity
        style={styles.retryButton}
        onPress={() => router.push('/dashboard')}
        accessibilityLabel="Go to Products"
        accessibilityRole="button"
        accessibilityHint="Navigates to the products page"
      >
        <Text style={styles.retryText}>Go to Products</Text>
      </TouchableOpacity>
    </View>
  );

  // Main cart content view
  const renderCartContent = (): React.ReactElement => (
    <View style={styles.content}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryText}>Delivery Address:</Text>
        <Text style={styles.addressText}>{data!.deliveryAddress.label}</Text>
        <Text style={styles.addressText}>{data!.deliveryAddress.address}, {data!.deliveryAddress.city} - {data!.deliveryAddress.pincode}</Text>
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total Items: {data!.totalItems}</Text>
        <Text style={styles.totalText}>Subtotal: ₹ {data!.subtotal}</Text>
        <Text style={styles.totalText}>Grand Total: ₹ {data!.grandTotal}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.checkoutButton]}
          onPress={() => router.push('/dashboard/payment')}
          accessibilityLabel="Proceed to Payment"
          accessibilityRole="button"
          accessibilityHint="Proceeds to the payment page"
        >
          <Text style={styles.checkoutText}>Proceed to Payment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContent = (): React.ReactElement => {
    if (isLoading) return renderLoadingView();
    if (error && cartItems.length > 0) return renderErrorView();
    if (cartItems.length === 0) return renderEmptyView();
    return renderCartContent();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.push('/dashboard')}
          style={styles.backButton}
          accessibilityLabel="Back to dashboard"
          accessibilityRole="button"
          accessibilityHint="Go back to the dashboard"
        >
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Cart Summary</Text>
        <View style={styles.placeholder} />
      </View>
      {renderContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    textAlign: 'center',
    flex: 1,
  },
  backButton: {
    padding: 4,
  },
  backText: {
    fontSize: 16,
    color: '#007bff',
  },
  placeholder: {
    width: 50,
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
  itemDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemDeposit: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  itemTotalPrice: {
    fontSize: 14,
    color: '#007bff',
    marginTop: 2,
  },
  summaryContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  summaryText: {
    fontSize: 14,
    color: '#111',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
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
  checkoutButton: {
    backgroundColor: '#007bff',
  },
  checkoutText: {
    fontSize: 16,
    color: '#fff',
  },
  deleteButton: {
    padding: 8,
  },
});