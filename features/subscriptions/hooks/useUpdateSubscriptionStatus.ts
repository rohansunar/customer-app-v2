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
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });
      showSuccess(
        `Subscription ${response.data.status === 'ACTIVE' ? 'Resumed' : 'Paused'}`,
      );
    },
    onError: (error) => {
      showError('Could not update subscription status. Please try again.');
    },
  });
}
