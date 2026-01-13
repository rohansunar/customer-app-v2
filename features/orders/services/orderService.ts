import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { Order, OrdersResponse } from '../types';

export const orderService = {
  getOrders(statuses?: string[]): Promise<OrdersResponse> {
    const params = statuses && statuses.length > 0 ? { status: statuses.join(',') } : {};
    return apiClient
      .get(`${API_ENDPOINTS.CUSTOMER_ORDER}`, { params })
      .then((res) => res.data);
  },

  getOrderById(id: string): Promise<Order> {
    return apiClient
      .get(`${API_ENDPOINTS.CUSTOMER_ORDER}/${id}`)
      .then((res) => res.data);
  },

  cancelOrder(id: string, cancelReason: string): Promise<any> {
    return apiClient
      .post(API_ENDPOINTS.CUSTOMER_ORDER_CANCEL.replace(':orderId', id), {
        cancelReason,
      })
      .then((res) => res.data);
  },
};
