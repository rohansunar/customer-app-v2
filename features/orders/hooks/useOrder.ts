import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

/**
 * Custom hook to fetch a single order by ID
 * Optimized with staleTime and cacheTime for better performance
 */
export function useOrder(id: string) {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOrderById(id),
    enabled: !!id,
    staleTime: 60000, // 1 minute - single order data is fresh longer
    gcTime: 300000, // 5 minutes
  });
}
