export type NotificationType =
  | 'order_confirmed'
  | 'order_processing'
  | 'order_out_for_delivery'
  | 'order_delivered'
  | 'order_cancelled';

export interface PushToken {
  token: string;
  platform: 'android' | 'ios';
  deviceId: string;
  isActive: boolean;
  createdAt: string;
  lastUsedAt: string;
}

export interface NotificationRoute {
  screen: string;
  params?: Record<string, string | number | boolean>;
}

export interface NotificationPermissionStatus {
  granted: boolean;
  provisional: boolean;
  canAskAgain?: boolean;
  expires: 'never' | 'temporal';
}
