import { useQuery } from '@tanstack/react-query';
import unsplashApi from '@/api/unsplash';
import { UnsplashPhoto } from '@/types/unsplash';

interface UsePhotoDetailsParams {
  photoId: string | null;
}

/**
 * Hook to fetch and cache individual photo details by ID
 * Ensures each photo is only fetched once and cached for future use
 */
export function usePhotoDetails({ photoId }: UsePhotoDetailsParams) {
  return useQuery({
    queryKey: ['photo', photoId],
    queryFn: async ({ signal }) => {
      if (!photoId) return null;

      const response = await unsplashApi.get<UnsplashPhoto>(
        `/photos/${photoId}`,
        { signal }
      );

      return response.data;
    },
    enabled: !!photoId,
    staleTime: 30 * 60 * 1000, // 30 minutes - individual photos rarely change
    gcTime: 24 * 60 * 60 * 1000, // 24 hours - keep photo details long-term
    retry: 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}

