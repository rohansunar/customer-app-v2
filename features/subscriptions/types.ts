import { Product } from '../product/types';

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
  custom_days?: number[];
  start_date: string;
  quantity: number;
}

export interface SubscriptionPreviewRequest {
  productId: string;
  frequency?: SubscriptionType;
  custom_days?: number[];
  start_date?: string;
  unit?: number;
}

export interface SubscriptionPreviewResponse {
  productName: string;
  productImage?: string;
  totalAmount: number;
  totalUnits: number;
  subscriptionPrice: number;
  frequency: SubscriptionType;
  startDate: string;
  nextDeliveryDate: string;
  forMonth: string;
  totalDeliveries: number;
}

export interface SubscriptionCustomerAddress {
  label: string;
  address: string;
  pincode: string;
  location?: {
    name: string;
    state: string;
  } | null;
}

export interface Subscription extends SubscriptionRequest {
  id: string;
  productId: string;
  product: Product;
  status: 'ACTIVE' | 'INACTIVE' | 'PROCESSING';
  createdAt: string;
  next_delivery_date: string;
  customerAddress?: SubscriptionCustomerAddress | null;
}

export interface PaginatedSubscriptionsResponse {
  subscriptions: Subscription[];
  limit: number;
  page: number;
  totalPages: number;
  totalSubscriptions: number;
}
