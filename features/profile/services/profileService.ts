import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';

type updateData = { 
  name: string;
  email: string | null;
  // is_available_today: boolean; 
}

export const profileService = {
  /**
   * Get logged-in user's profile
   */
  async getProfile() {
    const response = await apiClient.get(API_ENDPOINTS.VENDOR_ME);
    return response.data;
  },

   /**
   * Update editable profile fields
   */
  updateProfile(data: updateData) {
    console.log("Update editable profile fields", data);
    return apiClient.put(API_ENDPOINTS.VENDOR_ME, data);
  },
};
