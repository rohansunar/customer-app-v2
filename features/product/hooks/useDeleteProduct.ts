import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '../services/productService';

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.deleteProduct,

    onSuccess: () => {
      // Refresh product list after delete
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      console.log('❌ Product Delete failed');
      console.log(error);
    },
  });
}
