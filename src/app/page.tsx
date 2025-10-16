'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import SearchBar from '@/components/SearchBar';
import PhotoGrid from '@/components/PhotoGrid';
import Pagination from '@/components/Pagination';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import CacheIndicator from '@/components/CacheIndicator';
import { useUnsplashPhotos } from '@/hooks/useUnsplashPhotos';
import { useRandomPhotos } from '@/hooks/useRandomPhotos';
import { useDebounce } from '@/hooks/useDebounce';
import { isCacheHealthy } from '@/utils/cacheUtils';

const PHOTOS_PER_PAGE = 20;
const MIN_SEARCH_LENGTH = 3;
const DEBOUNCE_DELAY = 400; // milliseconds

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  // Check cache health on mount
  useEffect(() => {
    isCacheHealthy();
  }, []);
  
  // Debounce the search query
  const debouncedQuery = useDebounce(searchQuery, DEBOUNCE_DELAY);

  // Reset to page 1 when search query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= MIN_SEARCH_LENGTH) {
      setCurrentPage(1);
    }
  }, [debouncedQuery]);

  // Fetch search results (only when query is valid)
  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
    isFetching: isSearchFetching,
  } = useUnsplashPhotos({
    query: debouncedQuery,
    page: currentPage,
    perPage: PHOTOS_PER_PAGE,
    minLength: MIN_SEARCH_LENGTH,
  });

  // Fetch random photos for initial state
  const {
    data: randomPhotos,
    isLoading: isRandomLoading,
  } = useRandomPhotos({ count: PHOTOS_PER_PAGE });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Determine what to display
  const trimmedQuery = debouncedQuery.trim();
  const isQueryValid = trimmedQuery.length >= MIN_SEARCH_LENGTH;
  const hasSearched = isQueryValid;
  const isLoading = hasSearched ? isSearchLoading : isRandomLoading;
  const photos = hasSearched ? searchData?.results || [] : randomPhotos || [];
  const totalPages = hasSearched ? searchData?.total_pages || 0 : 1;
  const hasError = !!searchError;

  // Show searching indicator while debouncing or fetching
  const isSearching = 
    (searchQuery.length >= MIN_SEARCH_LENGTH && 
     (searchQuery !== debouncedQuery || isSearchFetching));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header />
      
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        minLength={MIN_SEARCH_LENGTH}
        isSearching={isSearching}
      />
      
      <CacheIndicator />

      {isLoading && <LoadingSpinner />}

      {!isLoading && !hasSearched && photos.length > 0 && (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Featured Photos
            </h2>
          </div>
          <PhotoGrid photos={photos} />
        </>
      )}

      {!isLoading && !hasSearched && photos.length === 0 && (
        <EmptyState type="no-search" />
      )}

      {!isLoading && hasSearched && hasError && (
        <EmptyState 
          type="error" 
          message="Failed to fetch photos. Please check your API key and try again."
        />
      )}

      {!isLoading && hasSearched && !hasError && photos.length === 0 && (
        <EmptyState 
          type="no-results"
          message={`No photos found for "${trimmedQuery}"`}
        />
      )}

      {!isLoading && hasSearched && photos.length > 0 && (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Search results for &quot;{trimmedQuery}&quot;
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {searchData?.total.toLocaleString()} photos found
            </p>
          </div>
          <PhotoGrid photos={photos} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}
