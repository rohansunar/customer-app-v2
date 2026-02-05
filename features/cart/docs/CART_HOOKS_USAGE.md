# Cart Hooks Usage Guide

## Overview

This document provides comprehensive usage examples for all cart-related hooks. Each example includes basic usage, error handling, and best practices.

---

## Table of Contents

1. [useCart](#usecart)
2. [useAddToCart](#useaddtocart)
3. [useDebouncedAddToCart](#usedebouncedaddtocart)
4. [useRemoveFromCart](#useremovefromcart)
5. [Utility Functions](#utility-functions)

---

## useCart

### Basic Usage

```tsx
import { useCart } from '@/features/cart/hooks/useCart';

function CartSummary() {
  const { data: cart, isLoading, error } = useCart();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (error) {
    return <Text>Error loading cart</Text>;
  }

  if (!cart) {
    return <Text>Your cart is empty</Text>;
  }

  return (
    <View>
      <Text>Items: {cart.totalItems}</Text>
      <Text>Subtotal: ₹{cart.subtotal}</Text>
      <Text>Total: ₹{cart.grandTotal}</Text>
    </View>
  );
}
```

### Accessing Cart Items

```tsx
function CartItemsList() {
  const { data: cart } = useCart();

  if (!cart?.cartItems.length) {
    return null;
  }

  return (
    <FlatList
      data={cart.cartItems}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <CartItemRow item={item} />
      )}
    />
  );
}
```

### Manual Refetch

```tsx
function CartWithRefresh() {
  const { data: cart, refetch, isRefetching } = useCart();

  const handleRefresh = async () => {
    await refetch();
    // Cart is now synced with server
  };

  return (
    <View>
      <Button
        title="Refresh Cart"
        onPress={handleRefresh}
        loading={isRefetching}
      />
      {/* Cart content */}
    </View>
  );
}
```

### Derived State

```tsx
function CartAnalytics() {
  const { data: cart } = useCart();

  // Derived state - no need to store separately
  const itemCount = cart?.cartItems.length ?? 0;
  const hasDeposits = cart?.cartItems.some((item) => item.deposit !== null);
  const totalDeposit = cart?.cartItems.reduce(
    (sum, item) => sum + (item.deposit ?? 0),
    0
  ) ?? 0;

  return (
    <View>
      <Text>Unique items: {itemCount}</Text>
      <Text>Has deposits: {hasDeposits ? 'Yes' : 'No'}</Text>
      <Text>Total deposit: ₹{totalDeposit}</Text>
    </View>
  );
}
```

---

## useAddToCart

### Basic Usage

```tsx
import { useAddToCart } from '@/features/cart/hooks/useAddToCart';

function AddToCartButton({ productId, price }) {
  const { mutate, isPending } = useAddToCart();

  const handlePress = () => {
    mutate({ productId, quantity: 1 });
  };

  return (
    <Button
      title="Add to Cart"
      onPress={handlePress}
      loading={isPending}
    />
  );
}
```

### With Error Handling

```tsx
import { useAddToCart } from '@/features/cart/hooks/useAddToCart';
import { showError } from '@/core/ui/toast';

function AddToCartWithError({ product }) {
  const { mutate, isPending, isError, error } = useAddToCart();

  // Error is automatically handled via toast,
  // but you can also access it here if needed
  if (isError) {
    console.error('Add to cart failed:', error);
  }

  return (
    <Button
      title="Add to Cart"
      onPress={() => mutate({ productId: product.id, quantity: 1 })}
      loading={isPending}
      disabled={isPending}
    />
  );
}
```

### Adding Multiple Quantities

```tsx
function QuantitySelector({ product }) {
  const [quantity, setQuantity] = useState(1);
  const { mutate } = useAddToCart();

  return (
    <View>
      <Button
        title="-"
        onPress={() => setQuantity(Math.max(1, quantity - 1))}
      />
      <Text>{quantity}</Text>
      <Button
        title="+"
        onPress={() => setQuantity(Math.min(10, quantity + 1))}
      />
      <Button
        title="Add to Cart"
        onPress={() =>
          mutate({
            productId: product.id,
            quantity,
          })
        }
      />
    </View>
  );
}
```

### With Callback

```tsx
function AddToCartWithAnalytics({ product }) {
  const { mutate } = useAddToCart();

  const handleAddToCart = () => {
    mutate(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => {
          // Track analytics event
          analytics.track('product_added', {
            productId: product.id,
            price: product.price,
          });
        },
      }
    );
  };

  return (
    <Button title="Add to Cart" onPress={handleAddToCart} />
  );
}
```

### Optimistic Update Behavior

```tsx
function ProductPage({ product }) {
  const { data: cart } = useCart();
  const { mutate } = useAddToCart();

  // The cart updates INSTANTLY when you call mutate
  // You can see the change immediately
  const isInCart = cart?.cartItems.some(
    (item) => item.productId === product.id
  );

  return (
    <View>
      <Text>{product.name}</Text>
      <Button
        title={isInCart ? 'Add Another' : 'Add to Cart'}
        onPress={() =>
          mutate({ productId: product.id, quantity: 1 })
        }
      />
      {/* Cart count updates immediately */}
      <Text>Cart: {cart?.totalItems ?? 0} items</Text>
    </View>
  );
}
```

---

## useDebouncedAddToCart

### Basic Usage (Recommended for Product Cards)

```tsx
import { useDebouncedAddToCart } from '@/features/cart/hooks/useDebouncedAddToCart';

function ProductCard({ product }) {
  // 500ms debounce prevents duplicate adds
  const { mutate, isPending, isDebounced } = useDebouncedAddToCart();

  return (
    <View>
      <Text>{product.name}</Text>
      <Button
        title={isPending ? 'Adding...' : 'Add to Cart'}
        onPress={() =>
          mutate({ productId: product.id, quantity: 1 })
        }
        disabled={isPending}
      />
      {isDebounced && (
        <Text>Processing...</Text>
      )}
    </View>
  );
}
```

### Custom Debounce Time

```tsx
// For high-value items, longer debounce to prevent accidents
const { mutate } = useDebouncedAddToCart(1000); // 1 second

// For quick-add items, shorter debounce
const { mutate } = useDebouncedAddToCart(200); // 200ms
```

### Preventing Rapid Clicks

```tsx
function RapidAddButton({ product }) {
  const { mutate, isPending, isDebounced } = useDebouncedAddToCart(500);

  // User can click rapidly, but only one request will be sent
  return (
    <View>
      <Button
        title="Add to Cart"
        onPress={() =>
          mutate({ productId: product.id, quantity: 1 })
        }
        loading={isPending}
        disabled={isPending || isDebounced}
      />
      {isDebounced && (
        <Text style={{ color: 'orange' }}>
          Please wait, processing...
        </Text>
      )}
    </View>
  );
}
```

### With Loading State

```tsx
function AddToCartWithFeedback({ product }) {
  const { mutate, isPending } = useDebouncedAddToCart();

  const handlePress = () => {
    mutate({ productId: product.id, quantity: 1 });
  };

  return (
    <View>
      <Button
        title={
          isPending
            ? 'Adding...'
            : isDebounced
            ? 'Queued...'
            : 'Add to Cart'
        }
        onPress={handlePress}
        loading={isPending}
        disabled={isPending || isDebounced}
      />
    </View>
  );
}
```

---

## useRemoveFromCart

### Basic Usage

```tsx
import { useRemoveFromCart } from '@/features/cart/hooks/useRemoveFromCart';

function CartItem({ item }) {
  const { mutate, isPending } = useRemoveFromCart();

  return (
    <View style={styles.item}>
      <Text>{item.name}</Text>
      <Text>Qty: {item.quantity}</Text>
      <Button
        title="Remove"
        onPress={() => mutate(item.id)}
        loading={isPending}
        variant="danger"
      />
    </View>
  );
}
```

### With Confirmation

```tsx
import { useRemoveFromCart } from '@/features/cart/hooks/useRemoveFromCart';
import { Alert } from 'react-native';

function RemovableCartItem({ item }) {
  const { mutate } = useRemoveFromCart();

  const handleRemove = () => {
    Alert.alert(
      'Remove Item',
      `Remove ${item.name} from cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => mutate(item.id),
        },
      ]
    );
  };

  return (
    <Button title="Remove" onPress={handleRemove} variant="outline" />
  );
}
```

### Optimistic Removal

```tsx
function CartItemWithInstantRemove({ item }) {
  const { mutate, isPending } = useRemoveFromCart();

  // Item is REMOVED from UI immediately
  // User sees instant feedback
  // If server fails, item comes back (rollback)
  return (
    <View style={[styles.item, isPending && styles.removing]}>
      <Text>{item.name}</Text>
      {isPending && (
        <ActivityIndicator size="small" color="gray" />
      )}
      <Button
        title="Remove"
        onPress={() => mutate(item.id)}
        disabled={isPending}
      />
    </View>
  );
}
```

### Bulk Operations

```tsx
function CartBulkActions() {
  const { mutate: remove, isPending: isRemoving } = useRemoveFromCart();
  const { data: cart } = useCart();

  const handleClearCart = () => {
    cart?.cartItems.forEach((item) => {
      remove(item.id);
    });
  };

  return (
    <Button
      title="Clear Cart"
      onPress={handleClearCart}
      disabled={isRemoving || !cart?.cartItems.length}
    />
  );
}
```

---

## Utility Functions

### cartCalculations

```tsx
import {
  calculateTotalItems,
  calculateSubtotal,
  calculateGrandTotal,
  removeItemFromCart,
  updateCartItemQuantity,
  createCartItem,
} from '@/features/cart/utils/cartCalculations';
```

### calculateTotalItems

```tsx
import { calculateTotalItems } from '@/features/cart/utils/cartCalculations';

const items = [
  { quantity: 2, name: 'Water Can' },
  { quantity: 3, name: 'Water Bottle' },
  { quantity: 1, name: 'Filter' },
];

const total = calculateTotalItems(items);
// Result: 6
```

### calculateSubtotal

```tsx
import { calculateSubtotal } from '@/features/cart/utils/cartCalculations';

const items = [
  { totalPrice: 50 },
  { totalPrice: 75.50 },
  { totalPrice: 25 },
];

const subtotal = calculateSubtotal(items);
// Result: 150.50
```

### calculateGrandTotal (includes deposits)

```tsx
import { calculateGrandTotal } from '@/features/cart/utils/cartCalculations';

const items = [
  { totalPrice: 50, deposit: 100 }, // Water can with ₹100 deposit
  { totalPrice: 25, deposit: null },
];

const grandTotal = calculateGrandTotal(items);
// Result: 175 (50 + 25 + 100)
```

### removeItemFromCart

```tsx
import { removeItemFromCart } from '@/features/cart/utils/cartCalculations';

const cart = {
  cartId: 'cart-1',
  cartItems: [
    { id: 'item-1', quantity: 2, totalPrice: 100 },
    { id: 'item-2', quantity: 1, totalPrice: 50 },
  ],
  totalItems: 3,
  subtotal: 150,
  grandTotal: 150,
};

const updatedCart = removeItemFromCart(cart, 'item-1');
// Result:
// {
//   cartId: 'cart-1',
//   cartItems: [{ id: 'item-2', quantity: 1, totalPrice: 50 }],
//   totalItems: 1,
//   subtotal: 50,
//   grandTotal: 50,
// }
```

### updateCartItemQuantity

```tsx
import { updateCartItemQuantity } from '@/features/cart/utils/cartCalculations';

const cart = {
  // ... cart data
};

const updatedCart = updateCartItemQuantity(cart, 'item-1', 5);
// If item-1 existed with quantity 2, it's now 5
// Totals are recalculated automatically
```

### createCartItem

```tsx
import { createCartItem } from '@/features/cart/utils/cartCalculations';

const newItem = createCartItem('prod-123', 2, 50, 100);
// Result:
// {
//   id: 'temp-1707139200000-abc123',
//   productId: 'prod-123',
//   quantity: 2,
//   price: '50',
//   deposit: 100,
//   totalPrice: 100,
//   name: '',
//   images: [],
//   description: '',
// }
```

---

## Error Handling Patterns

### Global Error Handling

```tsx
// Errors are automatically shown as toast via onError callback
const { mutate } = useAddToCart();

mutate({ productId: '123', quantity: 1 });
// If fails, showError() displays the error message
```

### Custom Error Handling

```tsx
const { mutate, isError, error } = useAddToCart();

const handleAddToCart = () => {
  mutate(
    { productId: product.id, quantity: 1 },
    {
      onError: (err) => {
        // Custom error handling
        if (err.message.includes('out of stock')) {
          showError('This product is out of stock');
        } else if (err.message.includes('limit')) {
          showError('You have reached the quantity limit');
        } else {
          showError('Failed to add to cart. Please try again.');
        }
      },
    }
  );
};
```

---

## Best Practices

### 1. Always Use Debouncing for User-Facing Actions

```tsx
// ❌ Wrong - can cause duplicate adds
const { mutate } = useAddToCart();

// ✅ Correct - prevents duplicates
const { mutate } = useDebouncedAddToCart();
```

### 2. Handle Loading States

```tsx
const { mutate, isPending } = useAddToCart();

// Disable button while pending
<Button
  title="Add to Cart"
  onPress={handleAddToCart}
  disabled={isPending}
  loading={isPending}
/>
```

### 3. Use Optimistic Updates in Components

```tsx
// The UI updates optimistically - use this to your advantage
const { data: cart } = useCart();

// Show instant feedback
<Text>Cart updated: {cart.totalItems} items</Text>
```

### 4. Don't Duplicate State

```tsx
// ❌ Wrong - duplicating cart data
const { data: cart } = useCart();
const [localCart, setLocalCart] = useState(cart);

// ✅ Correct - use cart data directly
const { data: cart } = useCart();
// Cart is already cached and updated
```

### 5. Clean Up Resources

```tsx
// React hooks automatically clean up
// No manual cleanup needed for these hooks
```

---

## Troubleshooting

### Common Issues

1. **Cart not updating instantly**
   - Ensure you're using the optimistic hooks
   - Check that React Query cache is properly set up

2. **Duplicate items being added**
   - Use `useDebouncedAddToCart` instead of `useAddToCart`

3. **Rollback not working**
   - Check that `onMutate` returns the context
   - Verify `onError` accesses `context.previousCart`

4. **Totals not recalculating**
   - Ensure you're using the utility functions
   - Check that all CartItem fields are properly populated

For more detailed troubleshooting, see [DEBUGGING.md](./DEBUGGING.md).
