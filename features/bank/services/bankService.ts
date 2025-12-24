import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import { BankAccount } from '../types';

export const bankService = {
  /**
   * Get user's bank accounts
   */
  async getBankAccounts(): Promise<BankAccount[]> {
    const response = await apiClient.get(API_ENDPOINTS.BANK);
    return response.data;
  },

  /**
   * Create a new bank account
   */
  createBankAccount(data: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
  }) {
    console.log('Create a new bank account', data);
    return apiClient.post(API_ENDPOINTS.BANK, data);
  },

  /**
   * Update bank account details by ID
   */
  updateBankAccount(
    id: string,
    data: {
      accountHolderName: string;
      accountNumber: string;
      ifscCode: string;
      bankName: string;
    },
  ) {
    return apiClient.put(`${API_ENDPOINTS.BANK}/${id}`, data);
  },

  /**
   * Delete bank account by ID
   */
  deleteBankAccount(id: string) {
    return apiClient.delete(`${API_ENDPOINTS.BANK}/${id}`);
  },
};
