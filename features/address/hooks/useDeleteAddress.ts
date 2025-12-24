import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../services/addressService';

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressService.deleteAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['addresses'],
      });
    },
  });
}
