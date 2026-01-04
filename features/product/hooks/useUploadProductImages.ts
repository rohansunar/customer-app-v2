import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productImageService } from '../services/productImageService';

export function useUploadProductImages(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      formData,
      onProgress,
    }: {
      formData: FormData;
      onProgress?: (p: number) => void;
    }) => productImageService.uploadImages(productId, formData, onProgress),

    onSuccess: () => {
      // Refresh product data to get latest images
      queryClient.invalidateQueries({
        queryKey: ['product', productId],
      });
    },
  });
}
