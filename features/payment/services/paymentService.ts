import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { ENV } from '@/core/config/env';
import RazorpayCheckout from 'react-native-razorpay';
import { PaymentRequest } from '../types';

export const paymentService = {
  /**
   * Create Order and Process Payment
   * Create Order and Process Payment
   */

  async createOrder(data: PaymentRequest) {
    const response = await apiClient.post(API_ENDPOINTS.CUSTOMER_ORDER, data);
    const order = response.data;
    if (order.payment.provider_payload == null) {
      return;
    }

    if (!ENV.RAZORPAY_KEY || !ENV.RAZORPAY_KEY.startsWith('rzp_')) {
      throw new Error(
        'Payment service is temporarily unavailable. Please try later.',
      );
    }

    const options = {
      key: ENV.RAZORPAY_KEY,
      // image: "https://yourlogo.com/logo.png",
      amount: order.payment.provider_payload.amount,
      currency: 'INR',
      order_id: order.payment.provider_payment_id,
      name: 'My App',
      description: order.description,
      prefill: {
        name: order.customer.name,
        email: order.customer.email,
        contact: order.customer.phone,
      },
    };

    if (!RazorpayCheckout) {
      throw new Error('Razorpay not linked.');
    }

    return await RazorpayCheckout.open(options);
  },
};
