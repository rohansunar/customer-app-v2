// Cart hook
import { useQuery } from '@tanstack/react-query';
import { cartService } from '../services/cartService';

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
  });
}