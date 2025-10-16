interface EmptyStateProps {
  type: 'no-search' | 'no-results' | 'error';
  message?: string;
}

export default function EmptyState({ type, message }: EmptyStateProps) {
  const getContent = () => {
    switch (type) {
      case 'no-search':
        return {
          icon: '🔍',
          title: 'Start your search',
          description: 'Enter a keyword to discover amazing photos from Unsplash',
        };
      case 'no-results':
        return {
          icon: '😔',
          title: 'No photos found',
          description: message || 'Try searching for something else',
        };
      case 'error':
        return {
          icon: '⚠️',
          title: 'Something went wrong',
          description: message || 'Unable to load photos. Please try again later.',
        };
    }
  };

  const content = getContent();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col items-center justify-center text-center">
        <div className="text-6xl mb-4">{content.icon}</div>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
          {content.title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          {content.description}
        </p>
      </div>
    </div>
  );
}

