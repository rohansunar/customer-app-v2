import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../services/addressService';

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressService.createAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['addresses'],
      });
    },
    onError: (error) => {
      console.log('❌ Address creation failed');
      console.log(error);
    },
  });
}
