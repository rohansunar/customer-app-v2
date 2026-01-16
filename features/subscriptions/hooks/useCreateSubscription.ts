import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { subscriptionService } from '../services/subscriptionService';
import { SubscriptionRequest } from '../types';

/**
 * Hook to handle subscription creation.
 */
export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SubscriptionRequest) =>
      subscriptionService.createSubscription(request),
    onSuccess: () => {
      // Invalidate relevant queries if any (e.g., user's subscriptions list)
      queryClient.invalidateQueries({ queryKey: ['subscriptions'] });

      Toast.show({
        type: 'success',
        text1: 'Subscription Created!',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: `${getErrorMessage(error)}`,
      });
    },
  });
}
