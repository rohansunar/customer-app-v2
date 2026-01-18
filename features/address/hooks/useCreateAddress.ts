import { getErrorMessage } from '@/core/utils/getErrorMessage';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { addressService } from '../services/addressService';

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addressService.createAddress,

    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === 'addresses' || query.queryKey[0] === 'cart',
      });
    },
    onError: (error) => {
      Toast.show({
        type: 'error',
        text1: `${getErrorMessage(error)}`,
      });
    },
  });
}
