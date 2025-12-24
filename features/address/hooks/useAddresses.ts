import { useAuth } from '@/core/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { addressService } from '../services/addressService';

export function useAddresses() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['addresses'],
    queryFn: addressService.getAddresses,
    enabled: isAuthenticated,
  });
}
