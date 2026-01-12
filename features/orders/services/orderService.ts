import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { Order, OrdersResponse } from '../types';

export const orderService = {
  getOrders(): Promise<OrdersResponse> {
    return apiClient
      .get(`${API_ENDPOINTS.CUSTOMER_ORDER}`)
      .then((res) => res.data);
  },

  getOrderById(id: string): Promise<Order> {
    return apiClient
      .get(`${API_ENDPOINTS.CUSTOMER_ORDER}/${id}`)
      .then((res) => res.data);
  },
};
