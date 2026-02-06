import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../services/addressService';
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useToastHelpers } from '@/core/utils/toastHelpers';

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();
  const showToast = useToastHelpers();

  return useMutation({
    mutationFn: (id: string) => addressService.setDefaultAddress(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['products'],
      });
      queryClient.invalidateQueries({
        queryKey: ['orders'],
      });
      queryClient.invalidateQueries({
        queryKey: ['addresses'],
      });
      queryClient.invalidateQueries({
        queryKey: ['subscriptions'],
      });
    },
    onError: (error) => {
      // Show error toast with user-friendly message
      showToast.error(`${getErrorMessage(error)}`);
    },
  });
}
