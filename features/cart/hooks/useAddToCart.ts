import { showSuccess } from '@/core/ui/toast';
import { useMutation } from '@tanstack/react-query';
import { cartService } from '../services/cartService';

export function useAddToCart() {
  return useMutation({
    mutationFn: cartService.addToCart,
    onSuccess: () => {
      showSuccess('Product added to cart successfully');
    },
    onError: (error) => {
      console.log('❌ Add to cart failed');
    },
  });
}