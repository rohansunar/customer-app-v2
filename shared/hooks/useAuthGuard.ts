import { useAuth } from '@/core/providers/AuthProvider';
import { router } from 'expo-router';
import { useEffect } from 'react';

/**
 * Protects private routes
 */
export function useAuthGuard() {
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, loading]);
}
