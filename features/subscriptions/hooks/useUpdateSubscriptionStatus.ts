import { showError, showSuccess } from '@/core/ui/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscriptionService';

/**
 * Hook to handle subscription status updates (e.g., Pause/Resume).
 */
export function useUpdateSubscriptionStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      subscriptionService.updateSubscriptionStatus(id),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      showSuccess(
        `Subscription ${data.status === 'ACTIVE' ? 'Resumed' : 'Paused'}`,
      );
    },
    onError: (error) => {
      console.log('Subscription update failed:', error);
      showError('Could not update subscription status. Please try again.');
    },
  });
}
