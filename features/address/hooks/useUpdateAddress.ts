import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../services/addressService';

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Parameters<typeof addressService.updateAddress>[1];
    }) => addressService.updateAddress(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['addresses'],
      });
    },
  });
}
