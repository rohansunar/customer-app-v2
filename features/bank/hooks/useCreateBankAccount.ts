import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bankService } from '../services/bankService';

export function useCreateBankAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bankService.createBankAccount,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bank-accounts'],
      });
    },
  });
}
