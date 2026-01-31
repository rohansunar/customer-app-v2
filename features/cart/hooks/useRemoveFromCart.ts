import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useToastHelpers } from '@/core/utils/toastHelpers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';
import { CartResponse } from '../types';

/**
 * Updates the cart cache by removing the specified item.
 * @param oldData - The current cart data.
 * @param id - The ID of the item to remove.
 * @returns The updated cart data.
 */
function updateCartCache(
  oldData: CartResponse | undefined,
  id: string,
): CartResponse | undefined {
  if (!oldData) return oldData;
  const itemToRemove = oldData.cartItems.find((item) => item.id === id);
  if (!itemToRemove) return oldData;
  const newCartItems = oldData.cartItems.filter((item) => item.id !== id);
  const newTotalItems = oldData.totalItems - itemToRemove.quantity;
  const newSubtotal = oldData.subtotal - itemToRemove.totalPrice;
  const newGrandTotal = oldData.grandTotal - itemToRemove.totalPrice;
  return {
    ...oldData,
    cartItems: newCartItems,
    totalItems: newTotalItems,
    subtotal: newSubtotal,
    grandTotal: newGrandTotal,
  };
}

/**
 * Custom hook to handle removing products from cart.
 * Optimistically updates the cache and shows feedback.
 *
 * @returns The mutation object for removing a product from the cart.
 */
export function useRemoveFromCart() {
  const queryClient = useQueryClient();
  const showToast = useToastHelpers();

  return useMutation({
    mutationFn: (id: string) => cartService.deleteCartItem(id),
    onSuccess: (data, id) => {
      queryClient.setQueryData(['cart'], (oldData: CartResponse | undefined) =>
        updateCartCache(oldData, id),
      );
      showToast.success('Item removed');
    },
    onError: (error) => {
      showToast.error(getErrorMessage(error));
    },
  });
}
