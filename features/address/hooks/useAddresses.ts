/**
 * useAddresses Hook
 *
 * Fetches the user's list of addresses using React Query for caching and synchronization.
 * Query is enabled only when user is authenticated to prevent unauthorized access.
 * Why React Query: Provides automatic caching, background refetching, and error handling.
 * Key logic: Invalidation in mutations ensures list updates after CRUD operations.
 * Dependencies: Relies on AuthProvider for authentication state and addressService for API calls.
 * Edge cases: Handles unauthenticated users by disabling query, preventing API errors.
 */
import { useAuth } from '@/core/providers/AuthProvider';
import { useQuery } from '@tanstack/react-query';
import { addressService } from '../services/addressService';

export function useAddresses() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: ['addresses'], // Unique key for caching and invalidation
    queryFn: addressService.getAddresses, // API call function
    enabled: isAuthenticated, // Conditional fetching based on auth
  });
}
