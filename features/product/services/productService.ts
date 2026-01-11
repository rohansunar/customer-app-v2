import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { Product } from '../types';

export const productService = {
  async getProducts(): Promise<{ data: Product[] }> {
    return apiClient.get(API_ENDPOINTS.PRODUCT).then((res) => res.data);
  },

  getProduct(id: string): Promise<Product> {
    return apiClient
      .get(`${API_ENDPOINTS.PRODUCT}/${id}`)
      .then((res) => res.data);
  },
};
