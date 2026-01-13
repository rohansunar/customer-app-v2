// Product list
import { useQuery } from '@tanstack/react-query';
import { orderService } from '../services/orderService';

export function useOrders(statuses?: string[]) {
  return useQuery({
    queryKey: ['orders', statuses],
    queryFn: () => orderService.getOrders(statuses),
  });
}
