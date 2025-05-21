import { useState, useCallback, useEffect } from 'react';
import { searchProperties } from '../firebaseConfig';
import { SearchResult } from '../../types';

interface SearchSuggestion {
  pid: string;
  fullAddress: string;
}

interface UseSearchSuggestionsProps {
  debounceMs?: number;
}

interface UseSearchSuggestionsReturn {
  suggestions: SearchSuggestion[];
  isLoading: boolean;
  error: Error | null;
  searchValue: string;
  setSearchValue: (value: string) => void;
}

export const useSearchSuggestions = ({
  debounceMs = 300,
}: UseSearchSuggestionsProps = {}): UseSearchSuggestionsReturn => {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  // Debounce the search value to prevent excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [searchValue, debounceMs]);

  const performSearch = useCallback(async (userInput: string) => {
    if (!userInput.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await searchProperties({
        searchString: userInput,
        isDetailed: false
      });

      const results = response.data as SearchResult[];
      const formattedSuggestions = results.map(result => ({
        pid: result.parcelId.toString(),
        fullAddress: result.fullAddress
      }));

      setSuggestions(formattedSuggestions);
    } catch (err) {
      setError(err instanceof Error ? err : 
        new Error('An error occurred while fetching suggestions'));
      setSuggestions([]);
    }
  }, []);

  // Fetch suggestions when debounced value changes
  useEffect(() => {
    const fetchSuggestions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await performSearch(debouncedValue);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedValue, performSearch]);

  return {
    suggestions,
    isLoading,
    error,
    searchValue,
    setSearchValue,
  };
}; 