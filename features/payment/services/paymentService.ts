import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { showError } from '@/core/ui/toast';
import RazorpayCheckout from 'react-native-razorpay';
import { ENV } from '../../../core/config/env';
import { PaymentRequest } from '../types';

export const paymentService = {
  /**
   * Process payment
   */
  async processPayment(data: PaymentRequest) {
    const response = await apiClient.post(API_ENDPOINTS.PAYMENT, data);
    const order = response.data;
    console.log("provider_payload.amount", order.provider_payload.amount)
    console.log("provider_payment_id", order.provider_payment_id)
    const options = {
      key: ENV.RAZORPAY_KEY_ID,
      amount: order.provider_payload.amount,
      currency: 'INR',
      order_id: order.provider_payment_id,
      name: 'My App',
      description: '',
      prefill: {
        email: 'test@example.com',
        contact: '9999999999',
      },
    };

    try {
      if (!RazorpayCheckout) {
        throw new Error("Razorpay SDK not linked. Are you using Expo Dev Client?");
      }

      const result = await RazorpayCheckout.open(options);
      console.log("Payment success", result);
      return result;
    } catch (error: any) {
      const message =
        error?.description ||
        error?.message ||
        "Payment cancelled or failed";
      showError(message)
    }
  },
};
