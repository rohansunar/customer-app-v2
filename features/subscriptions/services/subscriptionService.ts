import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { ENV } from '@/core/config/env';
import {
  PaginatedSubscriptionsResponse,
  Subscription,
  SubscriptionRequest,
} from '../types';
import RazorpayCheckout from 'react-native-razorpay';
import { showError } from '@/core/ui/toast';

export const subscriptionService = {
  /**
   * Creating a new subscription.
   */
  createSubscription: async (
    request: SubscriptionRequest,
  ) => {
    const response = await apiClient.post(API_ENDPOINTS.SUBSCRIPTION, request);
    const {customer , payment}  = response.data;

    if (payment.provider_payload == null) {
      return;
    }
    const options = {
      key: ENV.RAZORPAY_KEY,
      amount: payment.provider_payload.amount,
      currency: 'INR',
      order_id: payment.provider_payment_id,
      name: 'My App',
      description: 'Product Subscription Payment',
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.phone,
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
        showError(message);
      }
  },

  /**
   * Fetch all subscriptions with pagination.
   */
  getSubscriptions: async (
    page: number = 1,
    limit: number = 10,
  ): Promise<PaginatedSubscriptionsResponse> => {
    const response = await apiClient.get(API_ENDPOINTS.SUBSCRIPTION, {
      params: { page, limit },
    });
    return response.data;
  },

  /**
   * Update subscription status.
   */
  updateSubscriptionStatus: async (id: string): Promise<Subscription> => {
    return await apiClient.post(`${API_ENDPOINTS.SUBSCRIPTION}/${id}/toggle`);
  },
/**
 * Delete subscription details.
 */
  /**
   * Delete subscription details.
   */
  deleteSubscription: async (id: string): Promise<Subscription> => {
    return await apiClient.delete(`${API_ENDPOINTS.SUBSCRIPTION}/${id}`);
  },
};
