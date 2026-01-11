import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../services/addressService';

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => addressService.setDefaultAddress(id),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['addresses'],
      });
    },
  });
}