import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

/**
 * Custom hook to fetch orders list with optional status filtering
 * Optimized with staleTime and cacheTime for better performance
 */
export function useOrders(statuses?: string[]) {
  return useQuery({
    queryKey: ['orders', statuses],
    queryFn: () => orderService.getOrders(statuses),
    staleTime: 30000, // 30 seconds - data is fresh for this duration
    gcTime: 300000, // 5 minutes - cache persists for this duration
    refetchOnWindowFocus: true, // Refetch when user returns to app
  });
}
