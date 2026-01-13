import { Subscription, SubscriptionRequest } from '../types';

/**
 * Mock data for subscriptions.
 */
let mockSubscriptions: Subscription[] = [
  {
    id: 'sub_1',
    productId: 'prod_1',
    type: 'DAILY',
    quantity: 1,
    startDate: '2024-01-15',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sub_2',
    productId: 'prod_2',
    type: 'ALTERNATE',
    quantity: 2,
    startDate: '2024-01-16',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Mock service for handling subscription-related API calls.
 */
export const subscriptionService = {
  /**
   * Mock creating a new subscription.
   */
  createSubscription: async (
    request: SubscriptionRequest,
  ): Promise<Subscription> => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock response
    const newSubscription: Subscription = {
      id: Math.random().toString(36).substring(7),
      ...request,
      status: 'ACTIVE',
      createdAt: new Date().toISOString(),
    };

    mockSubscriptions = [newSubscription, ...mockSubscriptions];
    return newSubscription;
  },

  /**
   * Mock fetching all subscriptions.
   */
  getSubscriptions: async (): Promise<Subscription[]> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return [...mockSubscriptions];
  },

  /**
   * Mock updating subscription status.
   */
  updateSubscriptionStatus: async (
    id: string,
    status: 'ACTIVE' | 'CANCELLED',
  ): Promise<Subscription> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const index = mockSubscriptions.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Subscription not found');

    mockSubscriptions[index] = { ...mockSubscriptions[index], status };
    return mockSubscriptions[index];
  },

  /**
   * Mock updating product subscription details.
   */
  updateSubscription: async (
    id: string,
    request: Partial<SubscriptionRequest>,
  ): Promise<Subscription> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    const index = mockSubscriptions.findIndex((s) => s.id === id);
    if (index === -1) throw new Error('Subscription not found');

    mockSubscriptions[index] = { ...mockSubscriptions[index], ...request };
    return mockSubscriptions[index];
  },
};
