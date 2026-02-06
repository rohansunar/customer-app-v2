import { useToastHelpers } from '@/core/utils/toastHelpers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscriptionService';

/**
 * Hook to handle subscription deletion.
 */
export function useDeleteSubscription() {
  const queryClient = useQueryClient();
  const showToast = useToastHelpers();

  return useMutation({
    mutationFn: ({ id }: { id: string }) =>
      subscriptionService.deleteSubscription(id),
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['subscriptions'] });
      showToast.success('Subscription deleted');
    },
    onError: (error) => {
      showToast.error('Could not delete subscription. Please try again.');
    },
  });
}
