import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useToastHelpers } from '@/core/utils/toastHelpers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileService } from '../services/profileService';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const showToast = useToastHelpers();

  return useMutation({
    mutationFn: profileService.updateProfile,
    onSuccess: () => {
      showToast.success('Profile updated successfully');
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error) => {
      showToast.error(getErrorMessage(error));
    },
  });
}
