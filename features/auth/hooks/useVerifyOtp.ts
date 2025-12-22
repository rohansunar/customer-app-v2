import { useAuth } from '@/core/providers/AuthProvider';
import { saveToken } from '@/core/storage/secureStorage';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';

export function useVerifyOtp() {
  const { logout } = useAuth();
  
  return useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) =>
      authService.verifyOtp(phone, otp),

    onSuccess: (response) => {
      // Save JWT token securely
      saveToken(response.data.token);
    },
    onError: () => {
    // Defensive: ensure clean state
    logout();
    },
  });
}
