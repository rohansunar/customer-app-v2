import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { AddToCartData } from '../types';

export const cartService = {
  /**
   * Add product to cart
   */
  addToCart(data: AddToCartData) {
    return apiClient.post(API_ENDPOINTS.CART, data);
  },
};