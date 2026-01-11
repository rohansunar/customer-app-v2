import { showError, showSuccess } from '@/core/ui/toast';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profileService';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      showSuccess('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      showError(getErrorMessage(error));
    },
  });
}
