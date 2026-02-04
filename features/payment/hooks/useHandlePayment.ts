import { showError } from '@/core/ui/toast';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { paymentService } from '../services/paymentService';
import { PaymentMode, PaymentRequest } from '../types';

/**
 * Custom hook to handle payment processing with navigation and error handling.
 * Takes cartId as a parameter and returns a handlePayment function that accepts paymentMode.
 * On success, invalidates cart and order queries and navigates to '/home/orders'.
 * On error, displays an error message.
 *
 * @param cartId - The ID of the cart for payment.
 * @returns An object containing the handlePayment function and isPending status.
 */
export function useHandlePayment(cartId: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: PaymentRequest) => paymentService.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      router.push('/home/orders' as any);
    },
    onError: (error) => {
      showError(getErrorMessage(error));
    },
  });

  const handlePayment = (paymentMode: PaymentMode) => {
    mutation.mutate({ cartId, paymentMode });
  };

  return { handlePayment, isPending: mutation.isPending };
}
