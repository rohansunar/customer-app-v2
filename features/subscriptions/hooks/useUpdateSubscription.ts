import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { subscriptionService } from '../services/subscriptionService';
import { SubscriptionRequest } from '../types';

/**
 * Hook to handle subscription updates (e.g., editing frequency, quantity).
 */
export function useUpdateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      request,
    }: {
      id: string;
      request: Partial<SubscriptionRequest>;
    }) => subscriptionService.updateSubscription(id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });

      Toast.show({
        type: 'success',
        text1: 'Subscription Updated',
        text2: 'Your subscription details have been successfully changed.',
      });
    },
    onError: (error) => {
      console.error('Subscription update failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Update Failed',
        text2: 'Could not update subscription details. Please try again.',
      });
    },
  });
}
