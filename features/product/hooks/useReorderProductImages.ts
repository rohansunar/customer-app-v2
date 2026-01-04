import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productImageService } from '../services/productImageService';

export function useReorderProductImages(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (images: string[]) =>
      productImageService.reorderImages(productId, images),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['product', productId],
      });
    },
    onError: (error) => {
      console.log('❌ Image reorder failed');
      console.log(error);
    },
  });
}
