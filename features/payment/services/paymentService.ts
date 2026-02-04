import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { ENV } from '@/core/config/env';
import { showError } from '@/core/ui/toast';
import RazorpayCheckout from 'react-native-razorpay';
import { PaymentRequest } from '../types';

export const paymentService = {
  /**
   * Create Order and Process Payment
   */
  async createOrder(data: PaymentRequest) {
    const response = await apiClient.post(API_ENDPOINTS.CUSTOMER_ORDER, data);
    const order = response.data;
    if (order.payment.provider_payload == null) {
      return;
    }
    const options = {
      key: ENV.RAZORPAY_KEY,
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

    try {
      if (!RazorpayCheckout) {
        throw new Error(
          'Razorpay SDK not linked. Are you using Expo Dev Client?',
        );
      }

      return await RazorpayCheckout.open(options);
    } catch (error: any) {
      const message =
        error?.description || error?.message || 'Payment cancelled or failed';

      console.log(message);
      if (message.error.code === 'BAD_REQUEST_ERROR') {
        return showError('Payment Cancelled');
      }
      showError(message);
    }
  },
};
