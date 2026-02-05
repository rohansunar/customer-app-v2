/**
 * useCreateAddress Hook
 *
 * Handles address creation via mutation, with automatic cache invalidation and error handling.
 * On success: Invalidates 'addresses' and 'cart' queries to refresh dependent data (e.g., cart might use default address).
 * On error: Displays toast with parsed error message for user feedback.
 * Why mutation: Encapsulates async operation, provides loading states, and handles side effects.
 * Dependencies: Uses QueryClient for cache management and addressService for API.
 * Edge cases: Network failures trigger error toast; success ensures UI consistency.
 */
import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { addressService } from '../services/addressService';

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressService.createAddress, // API call for creation

    onSuccess: () => {
      // Invalidate related queries to sync data across components
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'addresses' || query.queryKey[0] === 'cart',
      });
    },
    onError: (error) => {
      console.log('useCreateAddress', error);
      // Show error toast with user-friendly message
      Toast.show({
        type: 'error',
        text1: `${getErrorMessage(error)}`,
      });
    },
  });
}
