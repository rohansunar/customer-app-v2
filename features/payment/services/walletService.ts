import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { ENV } from '@/core/config/env';
import RazorpayCheckout from 'react-native-razorpay';
import {
  WalletTopUpRequest,
  WalletTopUpResponse,
  WalletTransaction,
} from '../types';

/**
 * Wallet service for handling wallet top-up and transaction operations.
 * Provides methods for creating top-up orders and retrieving transaction history.
 */
export const walletService = {
  /**
   * Create a wallet top-up order and process payment via Razorpay.
   * Creates an order with the payment provider and opens the Razorpay checkout.
   *
   * @param data - The wallet top-up request containing the amount.
   * @returns The Razorpay payment response or throws an error.
   */
  async createTopUpOrder(data: WalletTopUpRequest) {
    const response = await apiClient.post(API_ENDPOINTS.WALLET_PAYMENTS, data);
    const { customer, payment } = response.data;

    if (!payment?.provider_payload) {
      return;
    }

    if (!ENV.RAZORPAY_KEY) {
      throw new Error(
        'Payment service is temporarily unavailable. Please try later.',
      );
    }

    const options = {
      key: ENV.RAZORPAY_KEY,
      amount: payment.provider_payload.amount,
      currency: 'INR',
      order_id: payment.provider_payment_id,
      name: 'Droptro Wallet Top-Up',
      description: 'Add funds to your wallet',
      prefill: {
        name: customer.name,
        email: customer.email,
        contact: customer.contact,
      },
    };

    if (!RazorpayCheckout) {
      throw new Error('Razorpay not linked.');
    }

    // Open Razorpay checkout - returns payment response
    return await RazorpayCheckout.open(options);
  },

  /**
   * Retrieve wallet transaction history.
   * Fetches all transactions related to the user's wallet.
   *
   * @returns Array of wallet transactions.
   */
  async getTransactions(): Promise<WalletTransaction[]> {
    const response = await apiClient.get<WalletTransaction[]>(
      API_ENDPOINTS.WALLET_TRANSACTIONS,
    );
    return response.data;
  },
};
