import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { AddToCartData, CartResponse } from '../types';

export const cartService = {
  /**
   * Add product to cart
   */
  addToCart(data: AddToCartData) {
    return apiClient.post(API_ENDPOINTS.CART, data);
  },
  /**
   * Get cart
   */
  async getCart(): Promise<CartResponse> {
    const response = await apiClient.get(API_ENDPOINTS.CART);
    return response.data;
  },
  /**
   * Delete cart item
   */
  deleteCartItem(id: string) {
    return apiClient.delete(`${API_ENDPOINTS.CART}/${id}`);
  },
};
