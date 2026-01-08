// src/types/order.ts

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

export interface Product {
  id: string;
  name: string;
  price: string;
}

export interface CartItem {
  id: string;
  quantity: number;
  price: string;
  product: Product;
}

export interface Cart {
  id: string;
  cartItems: CartItem[];
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
  status: OrderStatus;
  payment_status: string;
  created_at: string;
  cart: Cart;
  address: Address;
  assigned_rider_phone:string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
