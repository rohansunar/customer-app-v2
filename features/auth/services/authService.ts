import { apiClient } from '@/core/api/client';
import { API_ENDPOINTS } from '@/core/api/endpoints';

export const authService = {
  requestOtp(phone: string) {
    return apiClient.post(API_ENDPOINTS.REQUEST_OTP, { phone });
  },

  verifyOtp(phone: string, otp: string) {
    return apiClient.post(API_ENDPOINTS.VERIFY_OTP, { phone, otp });
  },
};
