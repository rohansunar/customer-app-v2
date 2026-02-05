/**
 * Remove from Cart Hook
 *
 * This hook handles removing items from the cart with optimistic UI updates.
 * Like useAddToCart, it provides instant feedback by updating the UI
 * before server confirmation.
 *
 * SOLID Principles:
 * - Single Responsibility: Focuses only on remove-from-cart logic
 * - Dependency Inversion: Uses cartCalculations utility for cart manipulations
 * - Composition: Uses React Query's useMutation pattern
 *
 * Key Features:
 * - Immediate UI feedback via optimistic updates
 * - Automatic rollback on API failure
 * - Error handling with user feedback
 * - Shared calculation logic with add-to-cart
 */

import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useToastHelpers } from '@/core/utils/toastHelpers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import { CartResponse } from '../types';
import { removeItemFromCart } from '../utils/cartCalculations';

/**
 * Custom hook to handle removing products from cart.
 *
 * This hook implements optimistic updates for instant UI feedback.
 * If the server request fails, the cart is rolled back to its previous state.
 *
 * This hook implements optimistic updates for instant UI feedback.
 * If the server request fails, the cart is rolled back to its previous state.
 *
 * @returns Mutation object containing:
 *   - mutate: Function to remove item by ID
 *   - isPending: Boolean indicating if request is in progress
 *   - isError: Boolean indicating if request failed
 *   - Other mutation state properties
 *
 * @example
 * ```typescript
 * const { mutate, isPending } = useRemoveFromCart();
 *
 * // Remove item from cart
 * mutate('item-123');
 *
 * // In a list component
 * <Button
 *   title="Remove"
 *   onPress={() => mutate(item.id)}
 *   loading={isPending}
 * />
 * ```
 * @returns Mutation object containing:
 *   - mutate: Function to remove item by ID
 *   - isPending: Boolean indicating if request is in progress
 *   - isError: Boolean indicating if request failed
 *   - Other mutation state properties
 *
 * @example
 * ```typescript
 * const { mutate, isPending } = useRemoveFromCart();
 *
 * // Remove item from cart
 * mutate('item-123');
 *
 * // In a list component
 * <Button
 *   title="Remove"
 *   onPress={() => mutate(item.id)}
 *   loading={isPending}
 * />
 * ```
 */
export function useRemoveFromCart() {
  // QueryClient instance for managing React Query cache
  // QueryClient instance for managing React Query cache
  const queryClient = useQueryClient();
  const showToast = useToastHelpers();

  return useMutation({
    /**
     * The mutation function that makes the actual API call
     * @param id - The ID of the cart item to remove
     */
    /**
     * The mutation function that makes the actual API call
     * @param id - The ID of the cart item to remove
     */
    mutationFn: (id: string) => cartService.deleteCartItem(id),

    /**
     * OPTIMISTIC UPDATE - Called BEFORE the mutation function
     *
     * This function:
     * 1. Creates a snapshot of current cart for rollback
     * 2. Updates cache by removing the item
     * 3. Returns context with previous state
     *
     * @param id - The ID of the item being removed
     * @returns Context with previous cart for rollback
     */
    onMutate: async (id: string) => {
      // Snapshot current cart for potential rollback
      const previousCart = queryClient.getQueryData<CartResponse>(['cart']);

      // Optimistically update: remove item from cache
      queryClient.setQueryData<CartResponse>(['cart'], (oldCart) => {
        if (!oldCart) return oldCart;
        return removeItemFromCart(oldCart, id);
      });

      // Return context for rollback
      return { previousCart };
    },

    /**
     * Called when mutation is SUCCESSFUL
     * Shows success feedback and ensures cache consistency
     *
     * @param _data - The API response data (unused)
     * @param id - The ID of the removed item
     */
    onSuccess: (_data, id) => {
      // Show success feedback to user
      showToast.success('Item removed');

      // Ensure cache consistency
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },

    /**
     * Called when mutation FAILS
     * Rollback to previous state and show error
     *
     * @param error - The error that caused the mutation to fail
     * @param _id - The ID of the item (unused)
     * @param context - Context with previous cart for rollback
     */
    onError: (error, _id, context) => {
      // Rollback to previous cart state if available
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart);
      }

      // Show error feedback to user
      showToast.error(getErrorMessage(error));
    },

    /**
     * Called when mutation is SETTLED
     * Ensures final cache consistency
     */
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },

    /**
     * Called when mutation is SETTLED
     * Ensures final cache consistency
     */
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

/**
 * Type definition for the optimistic update context
 * Returned from onMutate and used in onError for rollback
 */
export type RemoveFromCartContext = {
  /** The cart state before the mutation, used for rollback */
  previousCart: CartResponse | undefined;
};
