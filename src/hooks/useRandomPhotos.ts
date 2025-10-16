import { useQuery } from '@tanstack/react-query';
import unsplashApi from '@/api/unsplash';
import { UnsplashPhoto } from '@/types/unsplash';

interface UseRandomPhotosParams {
  count?: number;
}

export function useRandomPhotos({ count = 20 }: UseRandomPhotosParams = {}) {
  return useQuery({
    queryKey: ['photos', 'random', count],
    queryFn: async ({ signal }) => {
      const response = await unsplashApi.get<UnsplashPhoto[]>(
        '/photos/random',
        {
          params: {
            count,
          },
          signal,
        }
      );

      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - random photos stay fresh briefly
    gcTime: 10 * 60 * 1000, // 10 minutes - don't keep random photos too long
    retry: 1,
    refetchOnMount: false,
  });
}

