import { useMutation } from '@tanstack/react-query';
import { orderService } from '../services/orderService';
import { useToastHelpers } from '@/core/utils/toastHelpers';

export function useSubmitSupportTicket() {
  const showToast = useToastHelpers();
  return useMutation({
    mutationFn: (payload: {
      orderNo: string;
      subject: string;
      message: string;
    }) => orderService.submitSupportTicket(payload),
    onSuccess: () => {
      showToast.success(
        'We have received your request and will get back to you soon.',
      );
    },
    onError: () => {
      showToast.error('Could not submit your request. Please try again.');
    },
  });
}
