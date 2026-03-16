import { useMutation, useQueryClient } from '@tanstack/react-query';
import { walletService } from '../services/walletService';
import { WalletTopUpRequest } from '../types';

/**
 * Custom hook to handle wallet top-up payment processing.
 * Takes amount as a parameter and returns a handleTopUp function.
 * On success, invalidates profile queries to refresh wallet balance.
 * On error, displays an error message.
 *
 * @returns An object containing the handleTopUp function and isPending status.
 */
export function useWalletTopUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: WalletTopUpRequest) =>
      walletService.createTopUpOrder(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['customer'] });
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.invalidateQueries({ queryKey: ['customer'] });
    },
  });
}
