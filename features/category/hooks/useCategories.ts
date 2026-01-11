// Dummy hook for categories
import { useQuery } from '@tanstack/react-query';

type Category = {
  id: string;
  name: string;
};

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      // Dummy data
      return [
        { id: '1', name: 'Water' },
        { id: '2', name: 'Beverages' },
      ];
    },
  });
}