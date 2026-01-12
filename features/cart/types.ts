
export type AddToCartData = {
  productId: string;
  quantity: number;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  images: string[];
  description: string;
  quantity: number;
  price: string;
  deposit: number | null;
  totalPrice: number;
};

export type CartResponse = {
   cartId: string;
   deliveryAddress: {
     id: string;
     label: string;
     address: string;
     city: string;
     pincode: string;
   };
   cartItems: CartItem[];
   totalItems: number;
   subtotal: number;
   grandTotal: number;
};