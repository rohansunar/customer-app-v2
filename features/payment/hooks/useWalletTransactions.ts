import { useQuery } from '@tanstack/react-query';
import { walletService } from '../services/walletService';

/**
 * Custom hook to fetch wallet transaction history.
 * Provides access to the transactions data with loading and error states.
 *
 * @returns Query result containing transactions, isLoading, and error states.
 */
export function useWalletTransactions() {
  return useQuery({
    queryKey: ['wallet', 'transactions'],
    queryFn: () => walletService.getTransactions(),
    staleTime: 1000 * 60 * 2, // 2 minutes — prevents redundant requests on re-mount
    gcTime: 1000 * 60 * 10, // 10 minutes — retain in background cache
  });
}
