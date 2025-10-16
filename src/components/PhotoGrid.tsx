import Image from 'next/image';
import { UnsplashPhoto } from '@/types/unsplash';

interface PhotoGridProps {
  photos: UnsplashPhoto[];
}

export default function PhotoGrid({ photos }: PhotoGridProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 aspect-square cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <Image
              src={photo.urls.regular}
              alt={photo.alt_description || photo.description || 'Unsplash photo'}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-white font-medium text-sm truncate">
                  {photo.user.name}
                </p>
                {photo.description && (
                  <p className="text-white/80 text-xs mt-1 truncate">
                    {photo.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

