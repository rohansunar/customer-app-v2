import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';

export const productImageService = {
  /**
   * Upload multiple images for a product
   */
  uploadImages(
    productId: string,
    files: FormData,
    onProgress?: (percent: number) => void,
  ) {
    return apiClient.post(
      `${API_ENDPOINTS.PRODUCT_IMAGE}/${productId}`,
      files,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (event) => {
          if (!event.total) return;
          const percent = Math.round((event.loaded * 100) / event.total);
          onProgress?.(percent);
        },
      },
    );
  },

  /**
   * Delete a single image
   */
  deleteImage(productId: string, imageId: string) {
    return apiClient.delete(`${API_ENDPOINTS.PRODUCT_IMAGE}/${productId}`, {
      data: { imageId },
    });
  },

  /**
   * Reorder images
   * Expects: [{ imageId, position }]
   */
  reorderImages(productId: string, images: string[]) {
    return apiClient.put(
      `${API_ENDPOINTS.PRODUCT_IMAGE}/${productId}/reorder`,
      { imageIds: images },
    );
  },
};
