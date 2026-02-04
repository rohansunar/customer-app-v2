# Cart Feature Debugging Guide

## Overview

This guide provides comprehensive debugging instructions for the cart feature, including common issues, their causes, and step-by-step solutions.

---

## Table of Contents

1. [Common Issues](#common-issues)
2. [Debugging Tools](#debugging-tools)
3. [React Query DevTools](#react-query-devtools)
4. [Logging Strategies](#logging-strategies)
5. [Performance Profiling](#performance-profiling)
6. [Error Scenarios](#error-scenarios)
7. [State Investigation](#state-investigation)
8. [Network Inspection](#network-inspection)

---

## Common Issues

### Issue 1: Cart Not Updating Instantly

**Symptoms:**

- User clicks "Add to Cart" but UI doesn't update immediately
- Loading spinner appears instead of instant feedback

**Possible Causes:**

1. Not using optimistic update hooks
2. React Query cache not properly configured
3. Component not subscribed to cart query

**Diagnosis:**

```tsx
// Check if useCart is returning data
const { data: cart, isLoading } = useCart();

console.log('Cart data:', cart);
console.log('Is loading:', isLoading);
```

**Solutions:**

1. Use `useDebouncedAddToCart` instead of direct mutations
2. Ensure component is using `useCart` to subscribe to changes
3. Check React Query cache configuration

---

### Issue 2: Duplicate Items in Cart

**Symptoms:**

- Same product appears multiple times after clicking "Add to Cart" rapidly
- Cart shows incorrect quantities

**Possible Causes:**

1. Not using debounced hook
2. Race condition in optimistic updates
3. Server merging duplicates incorrectly

**Diagnosis:**

```tsx
// Check cart items for duplicates
const { data: cart } = useCart();

const productCounts = cart?.cartItems.reduce((acc, item) => {
  acc[item.productId] = (acc[item.productId] || 0) + 1;
  return acc;
}, {});

console.log('Product counts:', productCounts);
```

**Solutions:**

1. Always use `useDebouncedAddToCart` for user-facing buttons
2. Verify merge logic in `mergeCartItems` function
3. Check server-side duplicate handling

---

### Issue 3: Rollback Not Working

**Symptoms:**

- Cart stays in incorrect state after failed API call
- Item remains in cart even though server rejected it

**Possible Causes:**

1. `onMutate` not returning context
2. `onError` not accessing context properly
3. Cache manually modified outside hooks

**Diagnosis:**

```tsx
// Add logging to hooks
const { mutate } = useAddToCart({
  onMutate: (newItem) => {
    console.log('Optimistic update applied');
    const previousCart = queryClient.getQueryData(['cart']);
    console.log('Previous cart:', previousCart);
    return { previousCart };
  },
  onError: (error, variables, context) => {
    console.log('Error context:', context);
    if (context?.previousCart) {
      console.log('Rolling back to:', context.previousCart);
    }
  },
});
```

**Solutions:**

1. Ensure `onMutate` returns context object
2. Verify `onError` accesses `context.previousCart`
3. Don't manually modify cache outside hooks

---

### Issue 4: Totals Not Recalculating

**Symptoms:**

- Cart total doesn't update after adding/removing items
- Subtotal shows incorrect values

**Possible Causes:**

1. Not using calculation utilities
2. Missing deposit calculations
3. Cache updated with incorrect values

**Diagnosis:**

```tsx
// Manually calculate and compare
const { data: cart } = useCart();

const calculatedSubtotal = cart?.cartItems.reduce(
  (sum, item) => sum + Number(item.totalPrice),
  0,
);

const calculatedGrandTotal = cart?.cartItems.reduce((sum, item) => {
  const deposit = item.deposit ? Number(item.deposit) : 0;
  return sum + Number(item.totalPrice) + deposit;
}, 0);

console.log(
  'Cart subtotal:',
  cart?.subtotal,
  'Calculated:',
  calculatedSubtotal,
);
console.log(
  'Cart grandTotal:',
  cart?.grandTotal,
  'Calculated:',
  calculatedGrandTotal,
);
```

**Solutions:**

1. Use `calculateSubtotal` and `calculateGrandTotal` utilities
2. Always recalculate after cart modifications
3. Verify deposit amounts are included in totals

---

### Issue 5: Cart Disappears on Refresh

**Symptoms:**

- Cart data is lost after navigating away and back
- Cache doesn't persist between sessions

**Possible Causes:**

1. React Query garbage collection
2. App restart clears memory cache
3. No persistent storage

**Solutions:**

1. Implement AsyncStorage persistence for cart
2. Adjust `gcTime` to longer duration
3. Add manual cache persistence

```tsx
// Implement persistence (future improvement)
import { persistQueryClient } from '@tanstack/react-query-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const persister = createSyncStoragePersister({
  storage: AsyncStorage,
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
});
```

---

## Debugging Tools

### React Query DevTools

```tsx
// Add to your App.tsx or _layout.tsx
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Navigation />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

**Features:**

- View all queries and their status
- Inspect cache data
- Manually refetch or invalidate queries
- See query history

---

### Console Logging Helper

```tsx
// utils/cartDebugger.ts

/**
 * Debug helper for cart operations
 */
export const cartDebugger = {
  logCart: (label: string, cart: any) => {
    console.log(`[Cart] ${label}:`, {
      cartId: cart?.cartId,
      itemCount: cart?.cartItems?.length ?? 0,
      totalItems: cart?.totalItems ?? 0,
      subtotal: cart?.subtotal ?? 0,
      grandTotal: cart?.grandTotal ?? 0,
    });
  },

  logMutation: (label: string, status: string, data?: any) => {
    console.log(`[Cart Mutation] ${label} - ${status}`, data);
  },

  logOptimisticUpdate: (operation: string, item: any) => {
    console.log(`[Cart Optimistic] ${operation}:`, {
      productId: item.productId,
      quantity: item.quantity,
      timestamp: new Date().toISOString(),
    });
  },
};
```

**Usage:**

```tsx
import { cartDebugger } from '@/utils/cartDebugger';

function CartDebugView() {
  const { data: cart } = useCart();

  useEffect(() => {
    cartDebugger.logCart('CartScreen', cart);
  }, [cart]);

  // ... component
}
```

---

## React Query DevTools

### Installation

```bash
npm install @tanstack/react-query-devtools
```

### Configuration

```tsx
// In your QueryClientProvider setup
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,
      gcTime: 1000 * 60 * 10,
    },
  },
});

export function AppProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools
        initialIsOpen={false}
        position="bottom-right"
        toggleButtonProps={{
          style: {
            marginLeft: 'auto',
          },
        }}
      />
    </QueryClientProvider>
  );
}
```

### Using DevTools

1. **View Query Cache:**
   - Click DevTools button to open panel
   - See all active queries including ['cart']

2. **Inspect Cart Data:**
   - Click on ['cart'] query
   - View cached data structure

3. **Manual Operations:**
   - Click refresh icon to manually refetch
   - Click trash icon to clear query

4. **Monitor Mutations:**
   - Watch mutation status in real-time
   - See optimistic updates as they happen

---

## Logging Strategies

### Request/Response Logging

```tsx
// api/logger.ts

export const apiLogger = {
  request: (config: AxiosRequestConfig) => {
    console.log('[API Request]', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data,
      params: config.params,
      timestamp: new Date().toISOString(),
    });
    return config;
  },

  response: (response: AxiosResponse) => {
    console.log('[API Response]', {
      method: response.config.method?.toUpperCase(),
      url: response.config.url,
      status: response.status,
      data: response.data,
      duration: Date.now() - (response.config as any)._startTime,
    });
    return response;
  },

  error: (error: AxiosError) => {
    console.error('[API Error]', {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });
    return Promise.reject(error);
  },
};
```

**Apply to API Client:**

```tsx
// core/api/client.ts
apiClient.interceptors.request.use(apiLogger.request);
apiClient.interceptors.response.use(apiLogger.response, apiLogger.error);
```

### Mutation Lifecycle Logging

```tsx
function withMutationLogger<T>(
  mutationFn: (data: T) => Promise<any>,
  operationName: string,
) {
  return async (data: T) => {
    console.log(`[Mutation] ${operationName} started`, data);

    try {
      const result = await mutationFn(data);
      console.log(`[Mutation] ${operationName} succeeded`, result);
      return result;
    } catch (error) {
      console.error(`[Mutation] ${operationName} failed`, error);
      throw error;
    }
  };
}
```

---

## Performance Profiling

### React Developer Tools

1. **Record a Session:**
   - Open React DevTools
   - Click "Record" button
   - Perform cart operations
   - Click "Stop"

2. **Analyze Render Times:**
   - Look for long render bars (yellow)
   - Identify unnecessary re-renders
   - Check component hierarchy

3. **Identify Optimization Targets:**
   - Components re-rendering without prop changes
   - Expensive computations during render
   - Large component trees

### Performance Markers

```tsx
// Add performance markers to track timing
const withPerformanceTracking = (
  componentName: string,
  operation: () => void,
) => {
  console.time(`[Performance] ${componentName}`);
  operation();
  console.timeEnd(`[Performance] ${componentName}`);
};

// Usage
withPerformanceTracking('AddToCart', () => {
  mutate({ productId: '123', quantity: 1 });
});
```

---

## Error Scenarios

### Network Errors

**Symptoms:**

- Request fails without clear error message
- Cart state becomes inconsistent

**Debug Steps:**

```tsx
// Add error boundary
class CartErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('Cart Error:', error);
    console.error('Component Stack:', info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return <CartErrorView error={this.state.error} />;
    }
    return this.props.children;
  }
}
```

### Validation Errors

**Symptoms:**

- Server rejects add-to-cart request
- Error message about invalid data

**Debug Steps:**

```tsx
const { mutate } = useAddToCart();

mutate(
  { productId: product.id, quantity: quantity },
  {
    onError: (error) => {
      console.error('Validation error details:', {
        message: error.message,
        response: error.response?.data,
        validationErrors: error.response?.data?.errors,
      });
    },
  },
);
```

### Race Conditions

**Symptoms:**

- Cart shows unexpected state after rapid operations
- Items disappear or duplicate unexpectedly

**Debug Steps:**

```tsx
// Enable concurrent mode logging
const { mutate } = useAddToCart();

console.log('Mutation 1 started');
mutate({ productId: 'A', quantity: 1 });

console.log('Mutation 2 started');
mutate({ productId: 'B', quantity: 1 });

// Observe order of execution
```

---

## State Investigation

### Manual Cache Inspection

```tsx
function CartCacheInspector() {
  const queryClient = useQueryClient();

  const inspectCartCache = () => {
    const cart = queryClient.getQueryData(['cart']);
    console.log('Cart Cache:', cart);
    console.log('Cache Keys:', queryClient.getQueryCache().getAll());
  };

  return <Button title="Inspect Cache" onPress={inspectCartCache} />;
}
```

### Cache Manipulation

```tsx
function CartCacheControls() {
  const queryClient = useQueryClient();

  const clearCartCache = () => {
    queryClient.removeQueries({ queryKey: ['cart'] });
    console.log('Cart cache cleared');
  };

  const resetCartCache = () => {
    queryClient.setQueryData(['cart'], null);
    console.log('Cart cache reset to null');
  };

  const forceRefetchCart = async () => {
    await queryClient.refetchQueries({ queryKey: ['cart'] });
    console.log('Cart refetched');
  };

  return (
    <View>
      <Button title="Clear" onPress={clearCartCache} />
      <Button title="Reset" onPress={resetCartCache} />
      <Button title="Refetch" onPress={forceRefetchCart} />
    </View>
  );
}
```

---

## Network Inspection

### Using Flipper (React Native)

1. **Install Flipper:**

   ```bash
   npm install -g flipper
   ```

2. **Open Flipper:**

   ```bash
   flipper
   ```

3. **Monitor Network:**
   - Click "Network" plugin
   - See all HTTP requests
   - Inspect request/response bodies

### Using React Native Debugger

1. **Install:**

   ```bash
   npm install -g react-native-debugger
   ```

2. **Open Debugger:**

   ```bash
   react-native-debugger
   ```

3. **Inspect Network:**
   - View all network requests
   - See headers, payloads, responses

---

## Debugging Checklist

### Before Debugging

- [ ] Is React Query properly configured?
- [ ] Are hooks being used correctly?
- [ ] Is the API accessible?
- [ ] Are there any console errors?

### During Debugging

- [ ] Use React Query DevTools
- [ ] Add logging to track operations
- [ ] Verify cache state before/after operations
- [ ] Check network tab for API calls

### Common Fixes

| Issue            | Common Fix                  |
| ---------------- | --------------------------- |
| UI not updating  | Use `useDebouncedAddToCart` |
| Duplicates       | Enable debouncing           |
| Wrong totals     | Use calculation utilities   |
| Lost data        | Extend cache duration       |
| Slow performance | Memoize components          |

---

## Getting Help

### When to File an Issue

1. Bug is reproducible
2. Expected behavior is documented
3. Debugging steps attempted
4. No obvious workaround

### Information to Include

1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Environment (device, OS, app version)
5. Relevant logs and screenshots

### Related Documentation

- [Architecture Overview](./CART_FEATURE_ARCHITECTURE.md)
- [Data Flow Diagrams](./CART_DATA_FLOW.md)
- [Hook Usage Guide](./CART_HOOKS_USAGE.md)
- [Integration Guide](./CART_INTEGRATION.md)
