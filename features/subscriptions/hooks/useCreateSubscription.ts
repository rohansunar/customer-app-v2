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
        text2: 'Your subscription has been successfully saved.',
      });
    },
    onError: (error) => {
      console.error('Subscription creation failed:', error);
      Toast.show({
        type: 'error',
        text1: 'Subscription Failed',
        text2: 'Could not create subscription. Please try again.',
      });
    },
  });
}
