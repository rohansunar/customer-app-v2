import { useInfiniteQuery } from '@tanstack/react-query';
import { subscriptionService } from '../services/subscriptionService';

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
    queryKey: ['subscriptions'],
    queryFn: ({ pageParam = 1 }) =>
      subscriptionService.getSubscriptions(pageParam, limit),
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
    initialPageParam: 1,
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
    loadMore: () => fetchNextPage(),
    refetch,
  };
}
