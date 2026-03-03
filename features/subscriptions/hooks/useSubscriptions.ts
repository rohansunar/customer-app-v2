import { useInfiniteQuery } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscription.service';

/**
 * Hook for infinite scroll subscriptions using React Query.
 * Manages loading, error states, and accumulation of data.
 */
export function useSubscriptions(limit: number = 10) {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    error,
    fetchNextPage,
    refetch,
  } = useInfiniteQuery({
    // Include limit in the key so pagination settings don't share cache
    queryKey: ['subscriptions', { limit }],
    queryFn: ({ pageParam = 1 }) =>
      subscriptionService.getSubscriptions(pageParam, limit),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
    // Avoid aggressive retry loops when backend is down; users can pull-to-refresh
    retry: false,
    // Keep behaviour consistent across platforms when app regains focus
    refetchOnWindowFocus: false,
  });

  const subscriptions = data?.pages.flatMap((page) => page.subscriptions) ?? [];
  const loading = isLoading;
  const loadingMore = isFetchingNextPage;
  const hasMore = hasNextPage ?? false;
  const errorMessage = error
    ? error instanceof Error
      ? error.message
      : 'Failed to load subscriptions'
    : null;

  return {
    subscriptions,
    loading,
    loadingMore,
    hasMore,
    error: errorMessage,
    // Guarded loadMore to prevent extra fetch attempts when API is down
    loadMore: () => {
      if (!hasMore || loadingMore || loading || error) return;
      fetchNextPage();
    },
    refetch,
  };
}
