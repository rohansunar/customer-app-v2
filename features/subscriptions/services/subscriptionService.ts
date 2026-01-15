import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import {
  PaginatedSubscriptionsResponse,
  Subscription,
  SubscriptionRequest,
} from '../types';

export const subscriptionService = {
  /**
   * Creating a new subscription.
   */
  createSubscription: async (
    request: SubscriptionRequest,
  ): Promise<Subscription> => {
    console.log('newSubscription', request);

    return apiClient.post(API_ENDPOINTS.SUBSCRIPTION, request);
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
   * Update subscription details.
   */
  updateSubscription: async (
    id: string,
    request: Partial<SubscriptionRequest>,
  ): Promise<Subscription> => {
    return await apiClient.put(`${API_ENDPOINTS.SUBSCRIPTION}/${id}`, request);
  },
  /**
   * Delete subscription details.
   */
  deleteSubscription: async (id: string): Promise<Subscription> => {
    return await apiClient.delete(`${API_ENDPOINTS.SUBSCRIPTION}/${id}`);
  },
};
