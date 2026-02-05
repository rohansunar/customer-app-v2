// src/types/order.ts

// Payment mode type
export type PaymentMode = 'ONLINE' | 'COD';

// Payment status type
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';

// Existing types below

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface OrderItem {
  id: string;
  quantity: number;
  price: string;
  product: { name: string };
}

export interface Address {
  label: string;
  address: string;
  pincode: string;
}

export interface Order {
  id: string;
  orderNo: string;
  total_amount: string;
  delivery_status: OrderStatus;
  payment_status: string;
  payment_mode: string;
  created_at: string;
  orderItems: OrderItem[];
  address: Address;
  assigned_rider_phone: string;
  delivery_otp: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
