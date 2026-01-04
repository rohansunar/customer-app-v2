import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';

export const productImageService = {
  /**
   * Upload multiple images for a product
   */
  uploadImages(productId: string, files: FormData) {
    return apiClient.post(
      `${API_ENDPOINTS.PRODUCT_IMAGE}/${productId}`,
      files,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  /**
   * Delete a single image
   */
  deleteImage(productId: string, imageUrl: string) {
    return apiClient.delete(
      `${API_ENDPOINTS.PRODUCT_IMAGE}/${productId}`,
       {
        data: { imageUrl },
      }
    );
  },

  /**
   * Reorder images
   * Expects: [{ imageId, position }]
   */
  reorderImages(
    productId: string,
    images: string[]
  ) {
    return apiClient.put(
      `${API_ENDPOINTS.PRODUCT_IMAGE}/${productId}/reorder`,
       { imageIds:images }
    );
  },
};
