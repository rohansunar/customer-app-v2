import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bankService } from '../services/bankService';

export function useDeleteBankAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bankService.deleteBankAccount,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['bank-accounts'],
      });
    },
  });
}
