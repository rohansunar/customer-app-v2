/**
 * Payment-related type definitions.
 *
 * This module defines types for payment modes and payment requests,
 * ensuring type safety and reusability across the payment feature.
 */

/**
 * Represents the available payment modes.
 * - 'Cash': Payment made in cash.
 * - 'Online': Payment made online (e.g., via card or digital wallet).
 * - 'Monthly': Payment on a monthly basis (e.g., subscription).
 */
export type PaymentMode = 'COD' | 'ONLINE' | 'MONTHLY';

/**
 * Represents a payment request.
 * Contains the chosen payment mode and cart ID.
 */
export interface PaymentRequest {
  /** The mode of payment selected by the user. */
  paymentMode: PaymentMode;
  /** The ID of the cart for payment. */
  cartId: string;
}
