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
 */
export type PaymentMode = 'COD' | 'ONLINE';

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

/**
 * Represents a wallet top-up request.
 * Contains the amount to be added to the wallet.
 */
export interface WalletTopUpRequest {
  /** The amount to add to the wallet in rupees. */
  amount: number;
}

/**
 * Represents a wallet transaction.
 */
export interface WalletTransaction {
  /** Unique identifier for the transaction. */
  id: string;
  /** Type of transaction - credit or debit. */
  type: string;
  /** Amount of the transaction (comes as string from API). */
  amount: string | number;
  /** Description of the transaction. */
  description: string;
  /** Date of the transaction (legacy field). */
  date?: string;
  /** Creation date of the transaction. */
  createdAt?: string;
  /** Completion date of the transaction. */
  completedAt?: string;
  /** Current balance after transaction. */
  balance?: number;
  /** Current status of the transaction. */
  status?: string;
}

/**
 * Response from wallet top-up order creation.
 */
export interface WalletTopUpResponse {
  /** The order ID from payment provider. */
  orderId: string;
  /** The payment ID from payment provider. */
  paymentId: string;
  /** Provider-specific payload for payment initialization. */
  providerPayload: {
    amount: number;
    currency: string;
    order_id: string;
  } | null;
}
