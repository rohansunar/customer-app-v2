# Cart Feature Integration Guide

## Overview

This guide provides instructions for integrating the cart feature into new components, screens, and features. It covers common integration patterns, best practices, and step-by-step instructions.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Adding Add to Cart to a Product Card](#adding-add-to-cart-to-a-product-card)
3. [Displaying Cart Data](#displaying-cart-data)
4. [Creating Cart Management Screens](#creating-cart-management-screens)
5. [Handling Checkout Flow](#handling-checkout-flow)
6. [Adding Analytics](#adding-analytics)
7. [Extending the Cart Feature](#extending-the-cart-feature)

---

## Quick Start

### 1. Import Required Hooks

```tsx
// For displaying cart
import { useCart } from '@/features/cart/hooks/useCart';

// For adding items (with debouncing)
import { useDebouncedAddToCart } from '@/features/cart/hooks/useDebouncedAddToCart';

// For removing items
import { useRemoveFromCart } from '@/features/cart/hooks/useRemoveFromCart';

// For utility calculations
import { calculateGrandTotal } from '@/features/cart/utils/cartCalculations';
```

### 2. Basic Cart Display

```tsx
import { useCart } from '@/features/cart/hooks/useCart';

function CartSummary() {
  const { data: cart, isLoading } = useCart();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <View>
      <Text>Items: {cart?.totalItems ?? 0}</Text>
      <Text>Total: ₹{cart?.grandTotal ?? 0}</Text>
    </View>
  );
}
```

---

## Adding Add to Cart to a Product Card

### Step 1: Import the Hook

```tsx
import { useDebouncedAddToCart } from '@/features/cart/hooks/useDebouncedAddToCart';
```

### Step 2: Initialize the Hook

```tsx
function ProductCard({ product }) {
  // Use debounced version for user-facing buttons
  const { mutate, isPending } = useDebouncedAddToCart(500);

  // ... rest of component
}
```

### Step 3: Add Button with Handler

```tsx
function ProductCard({ product }) {
  const { mutate, isPending } = useDebouncedAddToCart(500);

  const handleAddToCart = () => {
    mutate({
      productId: product.id,
      quantity: 1,
    });
  };

  return (
    <Card>
      <Text>{product.name}</Text>
      <Text>₹{product.price}</Text>
      <Button
        title="Add to Cart"
        onPress={handleAddToCart}
        loading={isPending}
        disabled={isPending}
      />
    </Card>
  );
}
```

### Step 4: Complete Example

```tsx
import React, { memo, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card } from '@/core/ui/Card';
import { Text } from '@/core/ui/Text';
import { Button } from '@/core/ui/Button';
import { useDebouncedAddToCart } from '@/features/cart/hooks/useDebouncedAddToCart';
import { Product } from '@/features/product/types';

type ProductCardProps = {
  product: Product;
  onAddToCart?: (productId: string) => void;
};

export const ProductCard = memo(function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const { mutate, isPending } = useDebouncedAddToCart(500);

  const handleAddToCart = useCallback(() => {
    mutate({
      productId: product.id,
      quantity: 1,
    });

    if (onAddToCart) {
      onAddToCart(product.id);
    }
  }, [product.id, mutate, onAddToCart]);

  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.price}>₹{product.price}</Text>
      </View>
      <Button
        title={isPending ? 'Adding...' : 'Add to Cart'}
        onPress={handleAddToCart}
        loading={isPending}
        disabled={isPending}
      />
    </Card>
  );
});

const styles = StyleSheet.create({
  card: {
    margin: 8,
    padding: 16,
  },
  content: {
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  price: {
    fontSize: 16,
    color: '#666',
  },
});
```

---

## Displaying Cart Data

### Basic Cart Display

```tsx
import { useCart } from '@/features/cart/hooks/useCart';
import { FlatList, View, Text, StyleSheet } from 'react-native';

function CartScreen() {
  const { data: cart, isLoading } = useCart();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!cart || cart.cartItems.length === 0) {
    return <EmptyCartMessage />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cart.cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItemRow item={item} />
        )}
        ListFooterComponent={() => (
          <CartTotals cart={cart} />
        )}
      />
    </View>
  );
}

function CartTotals({ cart }) {
  return (
    <View style={styles.totals}>
      <View style={styles.row}>
        <Text>Subtotal:</Text>
        <Text>₹{cart.subtotal}</Text>
      </View>
      <View style={styles.row}>
        <Text>Deposits:</Text>
        <Text>
          ₹
          {cart.cartItems.reduce(
            (sum, item) => sum + (item.deposit ?? 0),
            0
          )}
        </Text>
      </View>
      <View style={[styles.row, styles.total]}>
        <Text style={styles.totalText}>Total:</Text>
        <Text style={styles.totalText}>₹{cart.grandTotal}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  totals: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  total: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});
```

---

## Creating Cart Management Screens

### Cart Item with Quantity Controls

```tsx
import { useRemoveFromCart } from '@/features/cart/hooks/useRemoveFromCart';
import { updateCartItemQuantity } from '@/features/cart/utils/cartCalculations';

function CartItemRow({ item }) {
  const { mutate: remove, isPending: isRemoving } = useRemoveFromCart();
  const { data: cart, queryClient } = useCart();

  const handleIncrease = () => {
    if (cart) {
      const updated = updateCartItemQuantity(cart, item.id, item.quantity + 1);
      queryClient.setQueryData(['cart'], updated);
    }
  };

  const handleDecrease = () => {
    if (cart) {
      if (item.quantity === 1) {
        remove(item.id);
      } else {
        const updated = updateCartItemQuantity(cart, item.id, item.quantity - 1);
        queryClient.setQueryData(['cart'], updated);
      }
    }
  };

  return (
    <View style={styles.row}>
      <Image source={{ uri: item.images[0] }} style={styles.image} />
      <View style={styles.info}>
        <Text>{item.name}</Text>
        <Text>₹{item.price} each</Text>
      </View>
      <View style={styles.quantity}>
        <Button
          title="-"
          onPress={handleDecrease}
          loading={isRemoving}
        />
        <Text>{item.quantity}</Text>
        <Button title="+" onPress={handleIncrease} />
      </View>
    </View>
  );
}
```

### Full Cart Management Screen

```tsx
import React from 'react';
import { View, FlatList, StyleSheet, SafeAreaView } from 'react-native';
import { useCart } from '@/features/cart/hooks/useCart';
import { useRemoveFromCart } from '@/features/cart/hooks/useRemoveFromCart';
import { Button } from '@/core/ui/Button';
import { Text } from '@/core/ui/Text';
import { CartItemRow } from './CartItemRow';
import { router } from 'expo-router';

export default function CartScreen() {
  const { data: cart, isLoading } = useCart();
  const { mutate: remove, isPending } = useRemoveFromCart();

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading cart...</Text>
      </View>
    );
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Button
            title="Continue Shopping"
            onPress={() => router.push('/products')}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="h1">Shopping Cart</Text>
        <Text>{cart.totalItems} items</Text>
      </View>

      <FlatList
        data={cart.cartItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CartItemRow item={item} />
        )}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text>Total:</Text>
          <Text variant="h2">₹{cart.grandTotal}</Text>
        </View>
        <Button
          title="Proceed to Checkout"
          onPress={handleCheckout}
          style={styles.checkoutButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  list: {
    padding: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkoutButton: {
    width: '100%',
  },
  emptyText: {
    fontSize: 18,
    marginBottom: 16,
  },
});
```

---

## Handling Checkout Flow

### Integration with Payment

```tsx
import { useCart } from '@/features/cart/hooks/useCart';
import { useMutation } from '@tanstack/react-query';
import { paymentService } from '@/features/payment/services/paymentService';

function CheckoutButton() {
  const { data: cart } = useCart();

  const checkoutMutation = useMutation({
    mutationFn: () =>
      paymentService.createOrder({
        cartId: cart!.cartId,
        items: cart!.cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      }),
    onSuccess: (order) => {
      router.push({
        pathname: '/payment',
        params: { orderId: order.id },
      });
    },
    onError: (error) => {
      showError('Failed to create order. Please try again.');
    },
  });

  return (
    <Button
      title={`Pay ₹${cart?.grandTotal ?? 0}`}
      onPress={() => checkoutMutation.mutate()}
      loading={checkoutMutation.isPending}
      disabled={!cart || cart.cartItems.length === 0}
    />
  );
}
```

### Order Summary Display

```tsx
function OrderSummary({ order }) {
  const { data: cart } = useCart();

  return (
    <View style={styles.summary}>
      <Text variant="h2">Order Summary</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Items ({cart?.totalItems})</Text>
        {cart?.cartItems.map((item) => (
          <View key={item.id} style={styles.item}>
            <Text>
              {item.quantity}x {item.name}
            </Text>
            <Text>₹{item.totalPrice}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text>Subtotal</Text>
          <Text>₹{cart?.subtotal}</Text>
        </View>
        <View style={styles.row}>
          <Text>Deposit</Text>
          <Text>
            ₹
            {cart?.cartItems.reduce(
              (sum, item) => sum + (item.deposit ?? 0),
              0
            )}
          </Text>
        </View>
        <View style={[styles.row, styles.total]}>
          <Text variant="h3">Total</Text>
          <Text variant="h3">₹{cart?.grandTotal}</Text>
        </View>
      </View>
    </View>
  );
}
```

---

## Adding Analytics

### Tracking Add to Cart

```tsx
import { useDebouncedAddToCart } from '@/features/cart/hooks/useDebouncedAddToCart';
import analytics from '@/core/analytics';

function ProductCard({ product }) {
  const { mutate } = useDebouncedAddToCart();

  const handleAddToCart = () => {
    mutate(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => {
          analytics.track('product_added', {
            productId: product.id,
            productName: product.name,
            price: product.price,
            quantity: 1,
            cartTotal: product.price,
          });
        },
      }
    );
  };

  return <Button title="Add to Cart" onPress={handleAddToCart} />;
}
```

### Tracking Remove from Cart

```tsx
import { useRemoveFromCart } from '@/features/cart/hooks/useRemoveFromCart';
import analytics from '@/core/analytics';

function CartItemRow({ item }) {
  const { mutate } = useRemoveFromCart();

  const handleRemove = () => {
    mutate(
      { itemId: item.id },
      {
        onSuccess: () => {
          analytics.track('product_removed', {
            productId: item.productId,
            productName: item.name,
            quantity: item.quantity,
            price: item.totalPrice,
          });
        },
      }
    );
  };

  return <Button title="Remove" onPress={handleRemove} />;
}
```

### Tracking Checkout

```tsx
import { useCart } from '@/features/cart/hooks/useCart';
import analytics from '@/core/analytics';

function CheckoutButton() {
  const { data: cart } = useCart();

  const handleCheckout = () => {
    analytics.track('begin_checkout', {
      items: cart!.cartItems.map((item) => ({
        id: item.productId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      value: cart!.grandTotal,
      currency: 'INR',
    });

    router.push('/checkout');
  };

  return (
    <Button
      title={`Pay ₹${cart?.grandTotal ?? 0}`}
      onPress={handleCheckout}
    />
  );
}
```

---

## Extending the Cart Feature

### Adding Quantity Update Hook

```tsx
// features/cart/hooks/useUpdateCartItemQuantity.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import { updateCartItemQuantity } from '../utils/cartCalculations';
import { CartResponse } from '../types';

export function useUpdateCartItemQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      quantity,
    }: {
      itemId: string;
      quantity: number;
    }) => cartService.updateQuantity(itemId, quantity),

    onMutate: async ({ itemId, quantity }) => {
      const cart = queryClient.getQueryData<CartResponse>(['cart']);

      await queryClient.cancelQueries({ queryKey: ['cart'] });

      queryClient.setQueryData<CartResponse>(['cart'], (oldCart) => {
        if (!oldCart) return oldCart;
        return updateCartItemQuantity(oldCart, itemId, quantity);
      });

      return { previousCart: cart };
    },

    onError: (error, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }
      showError('Failed to update quantity');
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
```

### Adding Clear Cart Hook

```tsx
// features/cart/hooks/useClearCart.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartService.clearCart(),

    onSuccess: () => {
      queryClient.setQueryData(['cart'], null);
      showSuccess('Cart cleared');
    },

    onError: () => {
      showError('Failed to clear cart');
    },
  });
}
```

### Adding Apply Coupon Hook

```tsx
// features/cart/hooks/useApplyCoupon.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';

export function useApplyCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (couponCode: string) =>
      cartService.applyCoupon(couponCode),

    onSuccess: (data) => {
      queryClient.setQueryData(['cart'], (oldCart: any) => ({
        ...oldCart,
        ...data,
      }));
      showSuccess('Coupon applied!');
    },

    onError: (error: any) => {
      showError(error.message || 'Invalid coupon');
    },
  });
}
```

---

## Best Practices

### 1. Always Use Debouncing for User Actions

```tsx
// ✅ Correct
const { mutate } = useDebouncedAddToCart();

// ❌ Avoid for user-facing buttons
const { mutate } = useAddToCart();
```

### 2. Handle Loading States

```tsx
<Button
  title="Add to Cart"
  onPress={handleAddToCart}
  loading={isPending}
  disabled={isPending}
/>
```

### 3. Provide Feedback

```tsx
// Toast messages are automatic via hooks
// But you can add custom feedback
const handleAddToCart = () => {
  mutate(
    { productId: product.id, quantity: 1 },
    {
      onSuccess: () => {
        showSuccess(`${product.name} added to cart`);
      },
    }
  );
};
```

### 4. Use Memoization

```tsx
export const ProductCard = memo(function ProductCard({
  product,
}: Props) {
  const handleAddToCart = useCallback(() => {
    // ...
  }, [product.id]);

  // Component won't re-render when other products change
});
```

### 5. Keep Components Focused

```tsx
// ✅ Good: Focused component
function AddToCartButton({ productId }) {
  const { mutate, isPending } = useDebouncedAddToCart();
  // ...
}

// ❌ Avoid: Do too much
function ProductPage({ product }) {
  const { mutate } = useDebouncedAddToCart();
  const { data: cart } = useCart();
  const { mutate: remove } = useRemoveFromCart();
  // Too many responsibilities
}
```

---

## Testing Integration

### Testing Components with Cart

```tsx
import { render, fireEvent } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ProductCard } from './ProductCard';

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

test('adds product to cart', () => {
  const mockProduct = {
    id: 'prod-123',
    name: 'Water Can',
    price: '50',
  };

  const { getByText } = render(
    <ProductCard product={mockProduct} />,
    { wrapper }
  );

  const addButton = getByText('Add to Cart');
  fireEvent.press(addButton);

  // Verify optimistic update
  const cart = queryClient.getQueryData(['cart']);
  expect(cart.totalItems).toBe(1);
});
```

For more testing examples, see [TEST_SETUP.md](./TEST_SETUP.md).
