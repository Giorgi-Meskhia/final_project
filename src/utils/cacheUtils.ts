/**
 * Utility functions for managing cache behavior
 */

export const CACHE_CONFIG = {
  // Search results cache duration
  SEARCH_STALE_TIME: 15 * 60 * 1000, // 15 minutes
  SEARCH_GC_TIME: 60 * 60 * 1000, // 1 hour
  
  // Individual photo cache duration
  PHOTO_STALE_TIME: 30 * 60 * 1000, // 30 minutes
  PHOTO_GC_TIME: 24 * 60 * 60 * 1000, // 24 hours
  
  // Random/featured photos cache
  RANDOM_STALE_TIME: 5 * 60 * 1000, // 5 minutes
  RANDOM_GC_TIME: 10 * 60 * 1000, // 10 minutes
  
  // Persistence settings
  PERSIST_MAX_AGE: 24 * 60 * 60 * 1000, // 24 hours
  PERSIST_THROTTLE: 1000, // 1 second
} as const;

/**
 * Normalize search query for consistent cache keys
 */
export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase();
}

/**
 * Generate a stable cache key for search queries
 */
export function getSearchCacheKey(query: string, page: number, perPage: number = 20): string[] {
  return ['search', normalizeSearchQuery(query), page, perPage];
}

/**
 * Generate a cache key for individual photos
 */
export function getPhotoCacheKey(photoId: string): string[] {
  return ['photo', photoId];
}

/**
 * Clear all Unsplash-related cache from localStorage
 */
export function clearPersistedCache() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('unsplash-gallery-cache');
  }
}

/**
 * Get cache statistics from localStorage
 */
export function getCacheStats() {
  if (typeof window === 'undefined') return null;
  
  try {
    const cacheData = localStorage.getItem('unsplash-gallery-cache');
    if (!cacheData) return null;
    
    const parsed = JSON.parse(cacheData);
    return {
      timestamp: parsed.timestamp,
      clientState: parsed.clientState,
      queriesCount: parsed.clientState?.queries?.length || 0,
      sizeBytes: new Blob([cacheData]).size,
    };
  } catch (error) {
    console.error('Error reading cache stats:', error);
    return null;
  }
}

/**
 * Check if cache is healthy and not corrupted
 */
export function isCacheHealthy(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const stats = getCacheStats();
    if (!stats) return true; // No cache is fine
    
    // Check if cache is too old (> 7 days)
    const now = Date.now();
    const cacheAge = now - stats.timestamp;
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    if (cacheAge > maxAge) {
      clearPersistedCache();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Cache health check failed:', error);
    clearPersistedCache();
    return false;
  }
}

