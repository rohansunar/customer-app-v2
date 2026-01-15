import { useQuery } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscriptionService';

/**
 * Hook to fetch all product subscriptions with pagination.
 */
export function useSubscriptions(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ['subscriptions', page, limit],
    queryFn: () => subscriptionService.getSubscriptions(page, limit),
  });
}
