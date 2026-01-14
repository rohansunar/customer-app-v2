import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
/**
 * Requests OTP for a phone number
 * Responsibility:
 * - Call backend
 * - Handle loading / error states
 * - No UI logic here
 */
export function useRequestOtp() {
  return useMutation({
    mutationFn: (phone: string) => {
      return authService.requestOtp(phone);
    },
  });
}
