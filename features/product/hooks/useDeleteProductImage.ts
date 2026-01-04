import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productImageService } from '../services/productImageService';

export function useDeleteProductImage(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (imageId: string) =>
      productImageService.deleteImage(productId, imageId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['product', productId],
      });
    },
    onError: (error) => {
      console.log('❌ Image Delete failed');
      console.log(error);
    },
  });
}
