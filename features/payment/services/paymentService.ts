import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { ENV } from '@/core/config/env';
import RazorpayCheckout from 'react-native-razorpay';
import { PaymentRequest } from '../types';

export const paymentService = {
  /**
   * Process payment
   */
  async processPayment(data: PaymentRequest) {
    const response = await apiClient.post(API_ENDPOINTS.PAYMENT, data);
    const order = response.data;
    if(order.provider_payload == null){
      return;
    }
    const options = {
      key: ENV.RAZORPAY_KEY,
      amount: order.provider_payload.amount,
      currency: 'INR',
      order_id: order.provider_payment_id,
      name: 'My App',
      description: 'First Payment',
      prefill: {
        name: 'Rohan Sunar',
        email: 'test@example.com',
        contact: '9999999999',
      },
    };

    try {
      if (!RazorpayCheckout) {
        throw new Error(
          'Razorpay SDK not linked. Are you using Expo Dev Client?',
        );
      }

      const result = await RazorpayCheckout.open(options);
      return result;
    } catch (error: any) {
      const message =
        error?.description || error?.message || 'Payment cancelled or failed';
      return message;
    }
  },
};
