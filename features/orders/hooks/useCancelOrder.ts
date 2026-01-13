import { showError, showSuccess } from '@/core/ui/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

/**
 * Custom hook to handle cancelling an order.
 * Uses React Query's useMutation to call the cancelOrder service.
 * On success, invalidates 'orders' and 'order' queries to refresh data.
 *
 * @returns The mutation object for cancelling an order.
 */
export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      cancelReason,
    }: {
      orderId: string;
      cancelReason: string;
    }) => orderService.cancelOrder(orderId, cancelReason),
    onSuccess: () => {
      showSuccess('Order cancelled successfully');
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
    onError: (error) => {
      showError('Failed to cancel order');
    },
  });
}
