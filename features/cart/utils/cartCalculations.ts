/**
 * Cart Calculations Utility Module
 *
 * This module provides pure functions for calculating cart totals and
 * manipulating cart data. These functions are designed to be:
 * - Deterministic: Same input always produces same output
 * - Immutable: Original cart data is never modified
 * - Reusable: Shared across multiple cart operations
 *
 * SOLID Principles:
 * - Single Responsibility: Each function has one purpose
 * - Pure Functions: No side effects, easy to test
 * - Composition: Functions can be combined for complex operations
 *
 * Usage Example:
 * ```typescript
 * import { calculateGrandTotal, removeItemFromCart } from '../utils/cartCalculations';
 *
 * const newCart = removeItemFromCart(cart, 'item-1');
 * const total = calculateGrandTotal(newCart.cartItems);
 * ```
 */

import { CartItem, CartResponse } from '../types';

/**
 * Configuration constant for temporary ID generation
 * Used to prefix temporary cart item IDs during optimistic updates
 */
export const TEMP_ID_PREFIX = 'temp';

/**
 * Generates a unique temporary ID for optimistic cart items.
 *
 * This ID is used to identify cart items that haven't been
 * confirmed by the server yet. The format is:
 * `temp-{timestamp}-{randomString}`
 *
 * @returns A unique string suitable for temporary cart item IDs
 *
 * @example
 * ```typescript
 * const tempId = generateTempId();
 * // Result: "temp-1707139200000-abc123def"
 * ```
 */
export function generateTempId(): string {
  return `${TEMP_ID_PREFIX}-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

/**
 * Calculates the total number of items in the cart.
 *
 * Counts all quantities across all cart items, not just the
 * number of unique items.
 *
 * @param items - Array of cart items to calculate from
 * @returns Total quantity count across all items
 *
 * @example
 * ```typescript
 * const items = [
 *   { quantity: 2 },
 *   { quantity: 3 },
 *   { quantity: 1 },
 * ];
 * const total = calculateTotalItems(items); // Result: 6
 * ```
 */
export function calculateTotalItems(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

/**
 * Calculates the subtotal of all cart items.
 *
 * The subtotal is the sum of item prices (excluding deposits).
 * Each item's totalPrice already includes quantity calculations.
 *
 * @param items - Array of cart items to calculate from
 * @returns Subtotal as a number
 *
 * @example
 * ```typescript
 * const items = [
 *   { totalPrice: 50 },
 *   { totalPrice: 75.50 },
 * ];
 * const subtotal = calculateSubtotal(items); // Result: 125.50
 * ```
 */
export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
}

/**
 * Calculates the grand total including item prices and deposits.
 *
 * The grand total is the sum of all item totalPrices plus
 * any deposit amounts. Deposits are typically refundable amounts
 * collected for returnable containers (like water can deposits).
 *
 * @param items - Array of cart items to calculate from
 * @returns Grand total including deposits
 *
 * @example
 * ```typescript
 * const items = [
 *   { totalPrice: 50, deposit: 100 }, // Water can with deposit
 *   { totalPrice: 25, deposit: null },
 * ];
 * const grandTotal = calculateGrandTotal(items); // Result: 175
 * ```
 */
export function calculateGrandTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => {
    const itemTotal = Number(item.totalPrice);
    const deposit = item.deposit ? Number(item.deposit) : 0;
    return sum + itemTotal + deposit;
  }, 0);
}

/**
 * Creates a new cart item with calculated values.
 *
 * Helper function to create a new cart item for optimistic updates.
 * This ensures consistent item structure across add operations.
 *
 * @param productId - The ID of the product being added
 * @param quantity - The quantity being added
 * @param price - The price per unit of the product
 * @param deposit - Optional deposit amount for returnable items
 * @returns A new CartItem object ready for optimistic update
 *
 * @example
 * ```typescript
 * const newItem = createCartItem('prod-123', 2, 50, 100);
 * // Result:
 * // {
 * //   id: "temp-1707139200000-abc123",
 * //   productId: "prod-123",
 * //   quantity: 2,
 * //   price: "50",
 * //   deposit: 100,
 * //   totalPrice: 100,
 * //   name: "",
 * //   images: [],
 * //   description: ""
 * // }
 * ```
 */
export function createCartItem(
  productId: string,
  quantity: number,
  price: string,
  deposit: number | null = null,
): CartItem {
  const itemTotal = Number(price) * quantity;

  return {
    id: generateTempId(),
    productId,
    name: '',
    images: [],
    description: '',
    quantity,
    price,
    deposit,
    totalPrice: itemTotal,
  };
}

/**
 * Creates the initial cart structure when adding the first item.
 *
 * Used when the cart doesn't exist yet and we need to create
 * a new cart with the first item.
 *
 * @param item - The cart item being added as the first item
 * @param deliveryAddress - Optional delivery address (defaults to undefined)
 * @returns A new CartResponse with the initial item
 *
 * @example
 * ```typescript
 * const initialItem = createCartItem('prod-123', 1, 50);
 * const cart = createInitialCart(initialItem);
 * ```
 */
export function createInitialCart(
  item: CartItem,
  deliveryAddress?: CartResponse['deliveryAddress'],
): CartResponse {
  const cartItems = [item];
  const subtotal = calculateSubtotal(cartItems);
  const grandTotal = calculateGrandTotal(cartItems);

  return {
    cartId: generateTempId(),
    deliveryAddress,
    cartItems,
    totalItems: item.quantity,
    subtotal,
    grandTotal,
  };
}

/**
 * Removes an item from the cart and recalculates totals.
 *
 * This function:
 * 1. Finds the item to remove by ID
 * 2. Filters it out of the cart items array
 * 3. Recalculates totalItems, subtotal, and grandTotal
 *
 * @param cart - The current cart data
 * @param itemId - The ID of the item to remove
 * @returns A new CartResponse with the item removed, or original if item not found
 *
 * @example
 * ```typescript
 * const updatedCart = removeItemFromCart(cart, 'item-456');
 * if (updatedCart !== cart) {
 *   // Item was successfully removed
 * }
 * ```
 */
export function removeItemFromCart(
  cart: CartResponse,
  itemId: string,
): CartResponse {
  const itemToRemove = cart.cartItems.find((item) => item.id === itemId);

  // If item not found, return original cart unchanged
  if (!itemToRemove) {
    return cart;
  }

  const newCartItems = cart.cartItems.filter((item) => item.id !== itemId);
  const depositAmount = itemToRemove.deposit ? Number(itemToRemove.deposit) : 0;

  return {
    ...cart,
    cartItems: newCartItems,
    totalItems: cart.totalItems - itemToRemove.quantity,
    subtotal: cart.subtotal - itemToRemove.totalPrice,
    grandTotal: cart.grandTotal - itemToRemove.totalPrice - depositAmount,
  };
}

/**
 * Updates the quantity of an existing item in the cart.
 *
 * This function handles both increasing and decreasing quantities.
 * If the new quantity is 0 or less, the item is removed.
 *
 * @param cart - The current cart data
 * @param itemId - The ID of the item to update
 * @param newQuantity - The new quantity value
 * @returns A new CartResponse with the updated item
 *
 * @example
 * ```typescript
 * // Increase quantity from 1 to 3
 * const updatedCart = updateCartItemQuantity(cart, 'item-456', 3);
 * ```
 */
export function updateCartItemQuantity(
  cart: CartResponse,
  itemId: string,
  newQuantity: number,
): CartResponse {
  const itemIndex = cart.cartItems.findIndex((item) => item.id === itemId);

  if (itemIndex === -1) {
    return cart;
  }

  const item = cart.cartItems[itemIndex];
  const quantityDiff = newQuantity - item.quantity;

  if (newQuantity <= 0) {
    // Remove item if quantity is 0 or less
    return removeItemFromCart(cart, itemId);
  }

  const updatedItem: CartItem = {
    ...item,
    quantity: newQuantity,
    totalPrice: Number(item.price) * newQuantity,
  };

  const newCartItems = [...cart.cartItems];
  newCartItems[itemIndex] = updatedItem;

  return {
    ...cart,
    cartItems: newCartItems,
    totalItems: cart.totalItems + quantityDiff,
    subtotal: calculateSubtotal(newCartItems),
    grandTotal: calculateGrandTotal(newCartItems),
  };
}

/**
 * Merges an incoming cart item with an existing item by product ID.
 *
 * Useful when adding the same product multiple times - instead of
 * creating duplicate items, we merge quantities.
 *
 * @param existingItems - Array of existing cart items
 * @param newItem - The new item to add or merge
 * @returns Array of cart items with the new item merged
 *
 * @example
 * ```typescript
 * const items = [
 *   { productId: 'prod-123', quantity: 1 },
 * ];
 * const newItem = { productId: 'prod-123', quantity: 2 };
 * const merged = mergeCartItems(items, newItem);
 * // Result: [{ productId: 'prod-123', quantity: 3 }]
 * ```
 */
export function mergeCartItems(
  existingItems: CartItem[],
  newItem: CartItem,
): CartItem[] {
  const existingIndex = existingItems.findIndex(
    (item) => item.productId === newItem.productId,
  );

  if (existingIndex >= 0) {
    // Item exists, merge quantities
    const existing = existingItems[existingIndex];
    const updated: CartItem = {
      ...existing,
      quantity: existing.quantity + newItem.quantity,
      totalPrice: Number(existing.totalPrice) + Number(newItem.totalPrice),
    };

    const result = [...existingItems];
    result[existingIndex] = updated;
    return result;
  }

  // Item doesn't exist, add as new
  return [...existingItems, newItem];
}
