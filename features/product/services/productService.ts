import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { Product } from '../types';

export const productService = {
  async getProducts(
    page = 1,
    limit = 10,
  ): Promise<{
    data: Product[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    return apiClient
      .get(API_ENDPOINTS.PRODUCT, { params: { page, limit } })
      .then((res) => res.data);
  },
};
