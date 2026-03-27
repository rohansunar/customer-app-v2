import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { ENV } from '@/core/config/env';
import {
  PaginatedSubscriptionsResponse,
  Subscription,
  SubscriptionPreviewRequest,
  SubscriptionPreviewResponse,
  SubscriptionRequest,
} from '../types';
import RazorpayCheckout from 'react-native-razorpay';

export const subscriptionService = {
  /**
   * Fetch the backend-calculated subscription preview for the current form state.
   */
  getSubscriptionPreview: async (
    request: SubscriptionPreviewRequest,
  ): Promise<SubscriptionPreviewResponse> => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.SUBSCRIPTION_PREVIEW_RECALCULATE,
        request,
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error(
          error.response.data?.message || 'Invalid subscription preview details',
        );
      }
      if (error.response?.status === 401) {
        throw new Error('Please login to preview a subscription');
      }
      throw error;
    }
  },

  /**
   * Creating a new subscription.
   */
  createSubscription: async (request: SubscriptionRequest) => {
    try {
      const response = await apiClient.post(
        API_ENDPOINTS.SUBSCRIPTION,
        request,
      );
      const { customer, payment } = response.data;
      if (!payment?.provider_payload) {
        // Return early if no payment payload is provided - might be zero-amount or handled elsewhere
        return response.data;
      }
      const options = {
        key: ENV.RAZORPAY_KEY,
        amount: payment.provider_payload.amount,
        currency: 'INR',
        order_id: payment.provider_payment_id,
        name: 'Droptro',
        description: 'Product Subscription Payment',
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
      };
      if (!RazorpayCheckout) {
        throw new Error(
          'Payment provider not initialized. Please try again later.',
        );
      }

      try {
        return await RazorpayCheckout.open(options);
      } catch (error: any) {
        // Handle Razorpay cancellation or failure
        const isCancelled =
          error.code === 0 ||
          (error.error && error.error.reason === 'payment_cancelled') ||
          (error.error && error.error.code === 'BAD_REQUEST_ERROR');

        if (isCancelled) {
          // Cleanup the orphaned subscription if payment was cancelled
          if (response.data?.id) {
            await subscriptionService.deleteSubscription(response.data.id);
          }
          throw new Error('PAYMENT_CANCELLED');
        }

        // Throw detailed error for non-cancellation failures
        throw new Error(error.description || error.message || 'Payment failed');
      }
    } catch (error: any) {
      // Re-throw processed error
      if (error.response?.status === 400) {
        throw new Error(
          error.response.data?.message || 'Invalid subscription details',
        );
      }
      if (error.response?.status === 401) {
        throw new Error('Please login to create a subscription');
      }
      throw error;
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
  deleteSubscription: async (id: string): Promise<Subscription> => {
    return await apiClient.delete(`${API_ENDPOINTS.SUBSCRIPTION}/${id}`);
  },
};
