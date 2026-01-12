import { showError } from '@/core/ui/toast';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { PaymentMode } from '../types';
import { usePayment } from './usePayment';

/**
 * Custom hook to handle payment processing with navigation and error handling.
 * Takes cartId as a parameter and returns a handlePayment function that accepts paymentMode and isPending.
 * On success, invalidates cart queries and navigates to '/dashboard/orders'.
 * On error, displays an error message.
 *
 * @param cartId - The ID of the cart for payment.
 * @returns An object containing the handlePayment function and isPending status.
 */
export function useHandlePayment(cartId: string) {
  const payment = usePayment();
  const queryClient = useQueryClient();

  const handlePayment = (paymentMode: PaymentMode) => {
    payment.mutate(
      { cartId, paymentMode },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['cart'] });
          router.push('/dashboard/orders');
        },
        onError: (error) => {
          showError(getErrorMessage(error));
        },
      }
    );
  };

  return { handlePayment, isPending: payment.isPending };
}