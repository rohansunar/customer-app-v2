import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { Product } from '../types';

export const productService = {
  getProducts(): Promise<Product[]> {
    return apiClient.get(API_ENDPOINTS.PRODUCT).then((res) => res.data);
  },

  getProduct(id: string): Promise<Product> {
    return apiClient
      .get(`${API_ENDPOINTS.PRODUCT}/${id}`)
      .then((res) => res.data);
  },

  createProduct(data: {
    name: string;
    description?: string;
    price: number;
    categoryId: string;
  }) {
    return apiClient.post(API_ENDPOINTS.PRODUCT, data);
  },

  updateProduct(
    id: string,
    data: {
      name: string;
      description?: string;
      price: number;
      is_active: boolean;
      categoryId: string;
    },
  ) {
    return apiClient.put(`${API_ENDPOINTS.PRODUCT}/${id}`, data);
  },

  /**
   * Soft delete product (mark inactive)
   */
  deleteProduct(id: string) {
    return apiClient.delete(`${API_ENDPOINTS.PRODUCT}/${id}`);
  },
  /**
   * Restore product (mark active)
   */
  restoreProduct(id: string) {
    return apiClient.put(`${API_ENDPOINTS.PRODUCT}/${id}/restore`);
  },
};
