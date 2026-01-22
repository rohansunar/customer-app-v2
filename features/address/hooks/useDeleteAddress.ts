/**
 * useDeleteAddress Hook
 *
 * Manages address deletion with cache invalidation for data consistency.
 * On success: Refreshes addresses and cart queries to reflect changes.
 * No error handling here; handled at call site for specific UI feedback.
 * Why separate hook: Reusability across components, centralized logic.
 * Dependencies: QueryClient for invalidation, addressService for deletion.
 * Edge cases: Deleting non-existent address handled by API; invalidation ensures UI updates.
 */
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addressService } from '../services/addressService';

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressService.deleteAddress, // API call for deletion

    onSuccess: () => {
      // Sync data by invalidating dependent queries
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'addresses' || query.queryKey[0] === 'cart',
      });
    },
  });
}
