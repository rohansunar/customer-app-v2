# Test Setup for Optimizations

## Required Dependencies

To run unit tests for the optimized hooks, install the following dependencies:

```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest jest-expo @types/jest
```

## Recommended jest.config.js

```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native|expo|@expo)',
  ],
};
```

## Test Examples

### useAddToCart Test Example

```typescript
import { renderHook, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAddToCart } from '../useAddToCart';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

it('optimistically updates cart count immediately', async () => {
  const { result } = renderHook(() => useAddToCart(), { wrapper });

  result.current.mutate({ productId: 'prod-1', quantity: 1 });

  await waitFor(() => {
    expect(result.current.isPending).toBe(true);
  });
});
```

### useDebouncedAddToCart Test Example

```typescript
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useDebouncedAddToCart } from '../useDebouncedAddToCart';

it('debounces rapid clicks', async () => {
  const { result } = renderHook(() => useDebouncedAddToCart(100), { wrapper });

  // Rapid clicks
  act(() => {
    result.current.mutate({ productId: 'prod-1', quantity: 1 });
    result.current.mutate({ productId: 'prod-2', quantity: 1 });
    result.current.mutate({ productId: 'prod-3', quantity: 1 });
  });

  // Should not have made 3 requests immediately
  expect(result.current.isDebounced).toBe(true);
});
```

### RequestDeduplicator Test Example

```typescript
import { RequestDeduplicator } from '../requestDeduplicator';

it('prevents duplicate requests', async () => {
  const deduplicator = new RequestDeduplicator(5000);
  let callCount = 0;

  const fn = () =>
    Promise.resolve(() => {
      callCount++;
      return 'result';
    });

  // Execute same request multiple times
  await deduplicator.execute('key1', fn);
  await deduplicator.execute('key1', fn);
  await deduplicator.execute('key1', fn);

  expect(callCount).toBe(1);
});
```

## Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npm test -- useAddToCart.test.ts

# Run with coverage
npm test -- --coverage
```

## CI Configuration

For GitHub Actions or similar CI systems:

```yaml
- name: Run Tests
  run: |
    npm install
    npm test -- --ci --maxWorkers=2
```
