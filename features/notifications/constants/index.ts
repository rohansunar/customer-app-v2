import { NotificationType } from '../types';

/**
 * NavigationTarget defines the destination and parameters for app navigation
 * triggered by a notification interaction.
 */
export interface NavigationTarget {
  route: string;
  params?: Record<string, any>;
}

/**
 * NOTIFICATION_NAVIGATION_MAP
 * 
 * Maps notification types (both deep-link and legacy) to their respective
 * app routes and parameter extraction logic.
 */
export const NOTIFICATION_NAVIGATION_MAP: Record<
  string, // Using string to allow flexibility for union types
  (data: any) => NavigationTarget
> = {
  // Deep Linking Types
  ORDER: (data) => ({
    route: '/(drawer)/home/orders',
    params: { orderId: data.orderId },
  }),
  LOW_BALANCE: () => ({
    route: '/(drawer)/profile',
    params: { topup: 'true' },
  }),
  SUBSCRIPTION: () => ({
    route: '/(drawer)/home/subscriptions',
  }),
  PROMOTION: () => ({
    route: '/(drawer)/home',
  }),
  // Backend types mapping (default to orders list)
  order_confirmed: () => ({ route: '/(drawer)/home/orders' }),
  order_processing: () => ({ route: '/(drawer)/home/orders' }),
  order_out_for_delivery: () => ({ route: '/(drawer)/home/orders' }),
  order_delivered: () => ({ route: '/(drawer)/home/orders' }),
  order_cancelled: () => ({ route: '/(drawer)/home/orders' }),
  // Default fallback
  generic: () => ({ route: '/(drawer)/home' }),
};
