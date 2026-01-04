import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';

export function useRestoreProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.restoreProduct,

    onSuccess: () => {
      // 🔥 Refresh product list
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.log('❌ Product Restore Failed');
      console.log(error);
    },
  });
}
