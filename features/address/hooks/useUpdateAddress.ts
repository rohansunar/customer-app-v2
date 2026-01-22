/**
 * useUpdateAddress Hook
 *
 * Facilitates address updates with structured parameters for id and data.
 * Uses TypeScript inference for data type from service method.
 * On success: Invalidates addresses query to refresh the list with updated data.
 * Why structured params: Ensures type safety and clarity in mutation calls.
 * Dependencies: QueryClient for cache sync, addressService for update API.
 * Edge cases: Update failures handled at call site; invalidation ensures consistency.
 */
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
      data: Parameters<typeof addressService.updateAddress>[1]; // Type-safe data param
    }) => addressService.updateAddress(id, data),

    onSuccess: () => {
      // Refresh addresses list after update
      queryClient.invalidateQueries({
        queryKey: ['addresses'],
      });
    },
  });
}
