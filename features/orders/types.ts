// src/types/order.ts

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED';

// export interface Product {
//   id: string;
//   name: string;
//   price: string;
// }

export interface OrderItem {
  id:string;
  quantity: number;
  price: string;
  product:{name:string};
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
  created_at: string;
  orderItems: OrderItem[];
  address: Address;
  assigned_rider_phone: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
