// Product list
import { useInfiniteQuery } from '@tanstack/react-query';
import { productService } from '../services/productService';

export function useProducts() {
  return useInfiniteQuery({
    queryKey: ['products'],
    queryFn: ({ pageParam = 1 }) => productService.getProducts(pageParam, 10),
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.totalPages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
  });
}
