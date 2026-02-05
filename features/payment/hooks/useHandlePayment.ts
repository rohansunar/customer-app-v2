import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useToastHelpers } from '@/core/utils/toastHelpers';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import { PaymentMode } from '../types';
import { usePayment } from './usePayment';

/**
 * Custom hook to handle payment processing with navigation and error handling.
 * Takes cartId as a parameter and returns a handlePayment function that accepts paymentMode and isPending.
 * On success, invalidates cart queries and navigates to '/home/orders'.
 * On error, displays an error message.
 *
 * @param cartId - The ID of the cart for payment.
 * @returns An object containing the handlePayment function and isPending status.
 */
export function useHandlePayment(cartId: string) {
  const payment = usePayment();
  const queryClient = useQueryClient();
  const showToast = useToastHelpers();

  const handlePayment = (paymentMode: PaymentMode) => {
    payment.mutate(
      { cartId, paymentMode },
      {
        onSuccess: () => {
          console.log('handlePaymentSuccess');
          queryClient.setQueryData(['cart'], null);
          router.push('/home/orders' as any);
        },
        onError: (error) => {
          showToast.error(getErrorMessage(error));
        },
      },
    );
  };

  return { handlePayment, isPending: payment.isPending };
}
