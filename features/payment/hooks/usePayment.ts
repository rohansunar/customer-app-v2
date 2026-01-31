import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useToastHelpers } from '@/core/utils/toastHelpers';
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
  const showToast = useToastHelpers();

  return useMutation({
    mutationFn: (data: PaymentRequest) => paymentService.processPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      showToast.error(getErrorMessage(error));
    },
  });
}
