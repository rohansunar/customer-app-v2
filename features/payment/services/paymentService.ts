import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { PaymentRequest } from '../types';

export const paymentService = {
  /**
   * Process payment
   */
  processPayment(data: PaymentRequest) {
    return apiClient.post(API_ENDPOINTS.PAYMENT, data);
  },
};
