import { useState, useCallback } from 'react';
import { getSearchResults } from '../firebaseConfig';
import { PropertySearchResults } from '../../types';

interface UseSearchResultsReturn {
  searchResults: PropertySearchResults | null;
  isLoading: boolean;
  error: Error | null;
  performSearch: (sequenceString: string) => Promise<void>;
}

export const useSearchResults = (): UseSearchResultsReturn => {
  const [searchResults, setSearchResults] = useState<PropertySearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const performSearch = useCallback(async (sequenceString: string) => {
    if (!sequenceString.trim()) {
      setSearchResults(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const results = await getSearchResults(sequenceString);
      setSearchResults(results);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching search results'));
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    searchResults,
    isLoading,
    error,
    performSearch,
  };
}; 