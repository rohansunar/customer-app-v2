import { useAuth } from '@/core/providers/AuthProvider';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';

export function useVerifyOtp() {
  const { logout, login } = useAuth();

  return useMutation({
    mutationFn: ({ phone, otp }: { phone: string; otp: string }) =>
      authService.verifyOtp(phone, otp),

    onSuccess: async (response) => {
      // Update auth state FIRST
      await login(response.data.token);
    },
    onError: () => {
      // Defensive: ensure clean state
      logout();
    },
  });
}
