import { Product } from '../product/types';

export type AddToCartData = {
  productId: string;
  quantity: number;
};

export type CartItem = {
  id: string;
  quantity: number;
  price: number;
  product: Product;
};

export type Cart = {
  id: string;
  cartItems: CartItem[];
};

export type CartResponse = {
  cartItems: CartItem[];
};