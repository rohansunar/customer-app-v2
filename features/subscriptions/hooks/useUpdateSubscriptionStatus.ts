import { showError } from '@/core/ui/toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
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

      Toast.show({
        type: 'success',
        text1: `Subscription ${data.status === 'ACTIVE' ? 'Resumed' : 'Paused'}`,
        text2: `Your subscription has been successfully ${data.status === 'ACTIVE' ? 'resumed' : 'paused'}.`,
      });
    },
    onError: (error) => {
      console.log('Subscription update failed:', error);
      showError('Could not update subscription status. Please try again.');
    },
  });
}
