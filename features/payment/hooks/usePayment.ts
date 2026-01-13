import { showError, showSuccess } from '@/core/ui/toast';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { paymentService } from '../services/paymentService';
import { PaymentRequest } from '../types';

/**
 * Custom hook to handle processing payments.
 * Invalidates the cart cache on success to reflect changes.
 *
 * @returns The mutation object for processing payment.
 */
export function usePayment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: PaymentRequest) => paymentService.processPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      showSuccess('Payment processed successfully');
    },
    onError: (error) => {
      showError(getErrorMessage(error));
    },
  });
}
