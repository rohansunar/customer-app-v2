import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscriptionService';

/**
 * Hook to fetch all product subscriptions.
 */
export function useSubscriptions() {
  return useQuery({
    queryKey: ['subscriptions'],
    queryFn: subscriptionService.getSubscriptions,
  });
}
