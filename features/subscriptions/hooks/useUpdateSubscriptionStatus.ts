import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscriptionService';
import { useToastHelpers } from '@/core/utils/toastHelpers';

/**
 * Hook to handle subscription status updates (e.g., Pause/Resume).
 */
export function useUpdateSubscriptionStatus() {
  const queryClient = useQueryClient();
  const showToast = useToastHelpers();

  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      subscriptionService.updateSubscriptionStatus(id),
    onSuccess: async (response) => {
      showToast.success(
        `Subscription ${response.status === 'ACTIVE' ? 'Resumed' : 'Paused'}`,
      );
      await queryClient.refetchQueries({ queryKey: ['subscriptions'] });
    },
    onError: (error) => {
      showToast.error(
        'Could not update subscription status. Please try again.',
      );
    },
  });
}
