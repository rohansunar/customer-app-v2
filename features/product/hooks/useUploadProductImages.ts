import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productImageService } from '../services/productImageService';

export function useUploadProductImages(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      productImageService.uploadImages(productId, formData),

    onSuccess: () => {
      // Refresh product data to get latest images
      queryClient.invalidateQueries({
        queryKey: ['product', productId],
      });
    },
  });
}
