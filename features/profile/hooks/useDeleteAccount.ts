import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useToastHelpers } from '@/core/utils/toastHelpers';
import { useAuth } from '@/core/providers/AuthProvider';
import { useMutation } from '@tanstack/react-query';
import { profileService } from '../services/profile.service';

/**
 * Hook to request account deletion.
 * Logs the user out on success to avoid stale tokens.
 */
export function useDeleteAccount() {
  const showToast = useToastHelpers();
  const { logout } = useAuth();

  return useMutation({
    mutationFn: () => profileService.deleteAccount(),
    onSuccess: async () => {
      showToast.info(
        'Deletion request received. Account will be permanently removed in 7 days. You will be logged out now.',
      );
      await logout();
    },
    onError: (error) => {
      showToast.error(getErrorMessage(error));
    },
  });
}
