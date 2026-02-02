import { useCallback } from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/core/providers/AuthProvider';

interface UseSplashNavigationReturn {
  /** Navigate to login screen */
  navigateToLogin: () => void;
  /** Navigate based on auth state */
  navigateBasedOnAuth: () => void;
}

export function useSplashNavigation(): UseSplashNavigationReturn {
  const { isAuthenticated } = useAuth();

  const navigateToLogin = useCallback(() => {
    router.replace('/(auth)/login');
  }, []);

  const navigateBasedOnAuth = useCallback(() => {
    if (isAuthenticated) {
      // AuthGuard will redirect to home if authenticated
      router.replace('/(drawer)/home');
    } else {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated]);

  return { navigateToLogin, navigateBasedOnAuth };
}
