/**
 * Add to Cart Hook with Optimistic UI Updates
 *
 * This hook manages the add-to-cart functionality with optimistic UI updates,
 * providing instant feedback to users while maintaining data consistency.
 *
 * OPTIMISTIC UI PATTERN:
 * Traditional approach: User clicks → Show loading → Wait for API → Update UI
 * Optimized approach: User clicks → Update UI immediately → Send API → Confirm/rollback
 *
 * This reduces perceived latency from ~500-2000ms to <50ms.
 *
 * SOLID Principles Applied:
 * - Single Responsibility: Focuses only on add-to-cart mutation logic
 * - Open-Closed: Extensible via callback props and custom strategies
 * - Dependency Inversion: Depends on cartService abstraction
 * - Composition: Uses cartCalculations utility for cart manipulations
 *
 * Key Features:
 * - Immediate UI feedback via optimistic updates
 * - Automatic rollback on API failure
 * - Query cancellation to prevent race conditions
 * - Support for quantity updates and new items
 */

import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useToastHelpers } from '@/core/utils/toastHelpers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import { AddToCartData, CartResponse } from '../types';
import {
  calculateTotalItems,
  calculateSubtotal,
  calculateGrandTotal,
  createCartItem,
  createInitialCart,
  mergeCartItems,
} from '../utils/cartCalculations';

/**
 * Custom hook to handle adding products to the cart with optimistic updates.
 *
 * This hook implements the optimistic UI pattern where the cart is updated
 * immediately in the UI before receiving server confirmation. If the server
 * request fails, the cart is rolled back to its previous state.
 *
 * @returns Mutation object containing:
 *   - mutate: Function to add item to cart
 *   - isPending: Boolean indicating if request is in progress
 *   - isError: Boolean indicating if request failed
 *   - Other mutation state properties
 *
 * @example
 * ```typescript
 * const { mutate, isPending } = useAddToCart();
 *
 * // Add item to cart
 * mutate({ productId: 'prod-123', quantity: 1 });
 *
 * // Handle different states
 * if (isPending) {
 *   // Show loading state
 * }
 * ```
 */
export function useAddToCart() {
  // QueryClient instance for managing React Query cache
  const queryClient = useQueryClient();
  const showToast = useToastHelpers();

  return useMutation({
    /**
     * The mutation function that makes the actual API call
     * Called after optimistic update is applied
     */
    mutationFn: cartService.addToCart,

    /**
     * OPTIMISTIC UPDATE - Called BEFORE the mutation function
     *
     * This function:
     * 1. Cancels any outgoing refetches to avoid overwriting our optimistic update
     * 2. Snapshots the current cart state for potential rollback
     * 3. Updates the cache with the optimistic new state
     * 4. Returns context with previous state for rollback
     *
     * @param newItem - The item being added to cart
     * @returns Context object with previous cart for rollback
     */
    onMutate: async (newItem: AddToCartData) => {
      // Step 1: Cancel outgoing refetches
      // This prevents race conditions where a refetch could overwrite our optimistic update
      await queryClient.cancelQueries({ queryKey: ['cart'] });

      // Step 2: Snapshot previous cart state
      // We'll restore this if the mutation fails
      const previousCart = queryClient.getQueryData<CartResponse>(['cart']);

      // Step 3: Apply optimistic update
      queryClient.setQueryData<CartResponse>(['cart'], (oldCart) => {
        // If no cart exists, create initial cart with the new item
        if (!oldCart) {
          const newCartItem = createCartItem(
            newItem.productId,
            newItem.quantity,
            '0', // Price will be updated with real value
            null,
          );
          return createInitialCart(newCartItem);
        }

        // Create the new item to add
        const newCartItem = createCartItem(
          newItem.productId,
          newItem.quantity,
          '0',
          null,
        );

        // Merge with existing items (handles quantity updates for same product)
        const updatedCartItems = mergeCartItems(oldCart.cartItems, newCartItem);

        // Recalculate totals
        const totalItems = calculateTotalItems(updatedCartItems);
        const subtotal = calculateSubtotal(updatedCartItems);
        const grandTotal = calculateGrandTotal(updatedCartItems);

        return {
          ...oldCart,
          cartItems: updatedCartItems,
          totalItems,
          subtotal,
          grandTotal,
        };
      });

      // Step 4: Return context for rollback
      return { previousCart };
    },

    /**
     * Called when mutation is SUCCESSFUL
     *
     * The UI is already updated with optimistic data,
     * so we invalidate to sync with server-authoritative data.
     * This ensures data consistency across the app.
     */
    onSuccess: () => {
      // Invalidate cart queries to refetch server data
      // This keeps the cache in sync with the server
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },

    /**
     * Called when mutation FAILS
     *
     * Rollback to the previous cart state and show error to user.
     * This ensures data consistency even when API calls fail.
     *
     * @param error - The error that caused the mutation to fail
     * @param _variables - The data passed to mutate
     * @param context - Context returned from onMutate (contains previous cart)
     */
    onError: (error, _variables, context) => {
      // Rollback to previous cart state if available
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }

      // Show error feedback to user
      showToast.error(getErrorMessage(error));
    },

    /**
     * Called when mutation is SETTLED (either success or error)
     *
     * Always ensure cache consistency after mutation.
     * This handles edge cases where the mutation settles
     * without triggering onSuccess or onError.
     */
    onSettled: () => {
      // Final consistency check - refetch to ensure sync
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

/**
 * Type definition for the optimistic update context
 * Returned from onMutate and used in onError for rollback
 */
export type AddToCartContext = {
  /** The cart state before the mutation, used for rollback */
  previousCart: CartResponse | undefined;
};
