import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';

type updateData = {
  name: string;
  email: string | null;
};

export const profileService = {
  /**
   * Get logged-in user's profile
   */
  async getProfile() {
    const response = await apiClient.get(API_ENDPOINTS.CUSTOMER_ME);
    const data = response.data;
    return {
      name: data.name,
      email: data.email,
      phone: data.phone,
      isActive: data.isActive,
      walletBalance: data.walletBalance ?? 4825.5, // Mocking balance for now
      recentTransactions: data.recentTransactions ?? [
        {
          id: '1',
          type: 'negative',
          amount: 129.0,
          description: 'Apple Store',
          date: 'May 24, 2024 • 2:45 PM',
        },
        {
          id: '2',
          type: 'positive',
          amount: 3200.0,
          description: 'Salary Deposit',
          date: 'May 22, 2024 • 9:00 AM',
        },
        {
          id: '3',
          type: 'negative',
          amount: 12.5,
          description: 'Starbucks Coffee',
          date: 'May 21, 2024 • 11:30 AM',
        },
        {
          id: '4',
          type: 'negative',
          amount: 85.2,
          description: 'Utility Bill',
          date: 'May 20, 2024 • 4:15 PM',
        },
      ],
    };
  },

  /**
   * Update editable profile fields
   */
  updateProfile(data: updateData) {
    return apiClient.put(API_ENDPOINTS.CUSTOMER_ME, data);
  },
};
