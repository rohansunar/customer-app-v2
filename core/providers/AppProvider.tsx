import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { AuthProvider } from './AuthProvider';
/**
 * QueryClient is the "brain" for React Query
 * It manages caching, retries, background updates
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 30,
    },
  },
});

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
       <AuthProvider>
        {children}
       </AuthProvider>
    </QueryClientProvider>
  );
}
