import { useAuth } from '@/core/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { bankService } from '../services/bankService';

export function useBankAccounts() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['bank-accounts'],
    queryFn: bankService.getBankAccounts,
    enabled: isAuthenticated,
  });
}
