/**
 * NotificationType represents the various categories of notifications
 * supported by the system, including both legacy backend types and 
 * modern deep-linking types.
 */
export type NotificationType =
  // Backend/Traditional types
  | 'order_confirmed'
  | 'order_processing'
  | 'order_out_for_delivery'
  | 'order_delivered'
  | 'order_cancelled'
  // Deep linking/Interaction types
  | 'ORDER'
  | 'LOW_BALANCE'
  | 'SUBSCRIPTION'
  | 'PROMOTION'
  | 'generic';

/**
 * PushToken represents the device token information stored or 
 * registered with the backend.
 */
export interface PushToken {
  token: string;
  platform: 'android' | 'ios' | 'ANDROID' | 'IOS';
  deviceId: string;
  isActive?: boolean;
  createdAt?: string;
  lastUsedAt?: string;
}

/**
 * NotificationPermissionStatus tracks the current state of 
 * notification permissions on the device.
 */
export interface NotificationPermissionStatus {
  granted: boolean;
  provisional: boolean;
  canAskAgain?: boolean;
  expires: 'never' | 'temporal';
}

/**
 * Data payloads for specific notification types.
 * These are used to provide type safety when handling notification data.
 */

export interface OrderNotificationData {
  type: 'ORDER';
  orderId: string;
}

export interface LowBalanceNotificationData {
  type: 'LOW_BALANCE';
}

export interface SubscriptionNotificationData {
  type: 'SUBSCRIPTION';
}

export interface PromotionNotificationData {
  type: 'PROMOTION';
  promoId?: string;
  url?: string;
}

/**
 * NotificationDataPayload is a union of all possible notification data structures.
 */
export type NotificationDataPayload =
  | OrderNotificationData
  | LowBalanceNotificationData
  | SubscriptionNotificationData
  | PromotionNotificationData
  | Record<string, unknown>;
