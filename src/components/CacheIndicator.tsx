'use client';

import { useEffect, useState } from 'react';
import { getCacheStats } from '@/utils/cacheUtils';

/**
 * Optional component to display cache statistics (for development/debugging)
 */
export default function CacheIndicator() {
  const [stats, setStats] = useState<ReturnType<typeof getCacheStats>>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const updateStats = () => {
      const cacheStats = getCacheStats();
      setStats(cacheStats);
    };

    updateStats();
    const interval = setInterval(updateStats, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== 'development') {
    return null; // Only show in development
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowStats(!showStats)}
        className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 px-3 py-2 rounded-lg text-xs font-mono shadow-lg hover:bg-gray-700 dark:hover:bg-gray-300 transition-colors"
      >
        {showStats ? '📊 Hide' : '💾 Cache'}
      </button>
      
      {showStats && stats && (
        <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 shadow-xl min-w-[250px]">
          <h3 className="text-sm font-semibold mb-2 text-gray-900 dark:text-white">
            Cache Statistics
          </h3>
          <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400 font-mono">
            <div className="flex justify-between">
              <span>Queries:</span>
              <span className="font-semibold">{stats.queriesCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span className="font-semibold">
                {(stats.sizeBytes / 1024).toFixed(2)} KB
              </span>
            </div>
            <div className="flex justify-between">
              <span>Age:</span>
              <span className="font-semibold">
                {Math.floor((Date.now() - stats.timestamp) / 1000 / 60)}m
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

