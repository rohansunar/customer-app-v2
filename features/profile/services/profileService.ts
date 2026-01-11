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
    };
  },

  /**
   * Update editable profile fields
   */
  updateProfile(data: updateData) {
    return apiClient.put(API_ENDPOINTS.CUSTOMER_ME, data);
  },
};
