import { useQuery } from '@tanstack/react-query';
import unsplashApi from '@/api/unsplash';
import { UnsplashSearchResponse } from '@/types/unsplash';

interface UseUnsplashPhotosParams {
  query: string;
  page: number;
  perPage?: number;
  minLength?: number;
}

export function useUnsplashPhotos({
  query,
  page,
  perPage = 20,
  minLength = 3,
}: UseUnsplashPhotosParams) {
  const trimmedQuery = query.trim().toLowerCase(); // Normalize for consistent caching
  const isQueryValid = trimmedQuery.length >= minLength;

  return useQuery({
    queryKey: ['search', trimmedQuery, page, perPage],
    queryFn: async ({ signal }) => {
      const response = await unsplashApi.get<UnsplashSearchResponse>(
        '/search/photos',
        {
          params: {
            query: trimmedQuery,
            page,
            per_page: perPage,
          },
          signal, // Enable request cancellation
        }
      );

      return response.data;
    },
    enabled: isQueryValid,
    staleTime: 15 * 60 * 1000, // 15 minutes - search results stay fresh longer
    gcTime: 60 * 60 * 1000, // 1 hour - keep in memory cache
    retry: 1,
    refetchOnMount: false, // Don't refetch if data is fresh
    refetchOnWindowFocus: false,
  });
}

