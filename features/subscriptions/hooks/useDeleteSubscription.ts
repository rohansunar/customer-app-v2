import { showError, showSuccess } from '@/core/ui/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscriptionService';

/**
 * Hook to handle subscription deletion.
 */
export function useDeleteSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      subscriptionService.deleteSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      showSuccess('Subscription deleted successfully');
    },
    onError: (error) => {
      console.log('Subscription deletion failed:', error);
      showError('Could not delete subscription. Please try again.');
    },
  });
}