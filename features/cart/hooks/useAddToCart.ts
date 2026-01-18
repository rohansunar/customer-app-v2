import { showError } from '@/core/ui/toast';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cartService';

/**
 * Custom hook to handle adding products to the cart.
 * Integrates with cart state management to trigger re-renders.
 *
 * @returns The mutation object for adding to cart.
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      showError(getErrorMessage(error));
    },
  });
}
