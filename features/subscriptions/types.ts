export type SubscriptionType = 'DAILY' | 'ALTERNATE' | 'CUSTOM';

export type DayOfWeek =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday';

export interface SubscriptionRequest {
  productId: string;
  type: SubscriptionType;
  customDays?: DayOfWeek[];
  startDate: string;
  quantity: number;
}

export interface Subscription extends SubscriptionRequest {
  id: string;
  status: 'ACTIVE' | 'CANCELLED';
  createdAt: string;
}
