import { useToastHelpers } from '@/core/utils/toastHelpers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export function useConfirmDelivery() {
  const queryClient = useQueryClient();
  const showToast = useToastHelpers();

  return useMutation({
    mutationFn: (orderId: string) => orderService.confirmDelivery(orderId),
    onSuccess: () => {
      showToast.success('Delivery confirmed successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
    onError: (error) => {
      showToast.error('Failed to confirm delivery. Try again later');
    },
  });
}
