/**
 * Cart Query Hook with Optimized Caching
 *
 * This hook fetches cart data with a carefully tuned caching strategy
 * that balances data freshness with performance.
 *
 * CACHING STRATEGY:
 * - staleTime (2 min): Data is considered "fresh" for 2 minutes
 * - gcTime (10 min): Data remains in memory cache for 10 minutes
 * - refetchOnMount: false - Don't refetch if data exists
 * - refetchOnWindowFocus: false - Don't refetch on tab/window focus
 * - refetchOnReconnect: false - Don't refetch on network reconnect
 *
 * Benefits:
 * - Reduced API calls (cache hits for repeated navigation)
 * - Instant cart data on back navigation
 * - No unnecessary loading states
 * - Still fresh enough for cart operations
 *
 * SOLID Principles:
 * - Single Responsibility: Only fetches and caches cart data
 * - Dependency Inversion: Depends on cartService abstraction
 */

import { useQuery } from '@tanstack/react-query';
import { cartService } from '../services/cartService';

/**
 * Configuration constants for query behavior
 * Centralized for easy tuning
 */
const CART_STALE_TIME_MS = 1000 * 60 * 2; // 2 minutes
const CART_GC_TIME_MS = 1000 * 60 * 10; // 10 minutes

/**
 * Custom hook to fetch cart data with optimized caching strategy.
 *
 * This hook provides:
 * - Access to current cart data
 * - Automatic caching and background updates
 * - Loading and error states
 * - Refetching capabilities
 *
 * @returns Query result object containing:
 *   - data: The cart response data (or undefined if not loaded)
 *   - isLoading: Boolean for initial load state
 *   - isError: Boolean for error state
 *   - error: The error object if isError is true
 *   - refetch: Function to manually refetch cart data
 *   - Other React Query properties
 *
 * @example
 * ```typescript
 * const { data: cart, isLoading, refetch } = useCart();
 *
 * if (isLoading) {
 *   return <LoadingSpinner />;
 * }
 *
 * if (cart) {
 *   return (
 *     <View>
 *       <Text>{cart.totalItems} items</Text>
 *       <Text>Total: ₹{cart.grandTotal}</Text>
 *     </View>
 *   );
 * }
 * ```
 */
export function useCart() {
  return useQuery({
    /**
     * Query key for cache identification
     * All queries with the same key share cached data
     */
    queryKey: ['cart'],

    /**
     * Query function that fetches data from API
     * Called when cache is stale or doesn't exist
     */
    queryFn: cartService.getCart,

    /**
     * Time in milliseconds before data is considered "stale"
     * Stale data won't trigger automatic background refetches
     */
    staleTime: CART_STALE_TIME_MS,

    /**
     * Time in milliseconds to keep unused data in cache
     * After this time, data is garbage collected if not used
     */
    gcTime: CART_GC_TIME_MS,

    /**
     * Disable refetching when:
     * - Component mounts (already have data)
     * - Window regains focus
     * - Network reconnects
     *
     * This significantly reduces API calls while keeping data fresh
     * due to the staleTime setting
     */
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
