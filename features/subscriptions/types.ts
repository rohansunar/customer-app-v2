export type SubscriptionType = 'DAILY' | 'ALTERNATIVE_DAYS' | 'CUSTOM_DAYS';

export type DayOfWeek =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface SubscriptionRequest {
  productId: string;
  frequency: SubscriptionType;
  custom_days?: DayOfWeek[];
  start_date: string;
  quantity: number;
}

export interface Subscription extends SubscriptionRequest {
  [x: string]: any;
  id: string;
  productId: string;
  status: 'ACTIVE' | 'INACTIVE' | 'PROCESSING';
  createdAt: string;
  next_delivery_date: string;
}

export interface PaginatedSubscriptionsResponse {
  subscriptions: Subscription[];
  limit: number;
  page: number;
  totalPages: number;
  totalSubscriptions: number;
}
