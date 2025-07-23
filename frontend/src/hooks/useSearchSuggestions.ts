import { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import { useParcelPairingsContext } from './useParcelPairingsContext';

interface UseSearchSuggestionsOptions {
  debounceMs?: number;
  maxSuggestions?: number;
  minQueryLength?: number;
  isMobile?: boolean;
  threshold?: number;
}

interface SearchSuggestion {
  parcelId: string;
  fullAddress: string;
}

export const useSearchSuggestions = ({ 
  debounceMs = 200,
  maxSuggestions = 20,
  minQueryLength = 1,
  isMobile = false,
  threshold
}: UseSearchSuggestionsOptions = {}) => {
  const [searchValue, setSearchValue] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { search, isLoading: isPairingsLoading, error } = useParcelPairingsContext();
  
  // Refs for request cancellation
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const searchIdRef = useRef<number>(0);
  const searchFrameRef = useRef<number | null>(null);

  // Track the latest search value for debouncing
  const latestSearchRef = useRef(searchValue);
  latestSearchRef.current = searchValue;

  // Debounce the search value with mobile optimization
  useEffect(() => {
    // Clear any existing timeout and animation frame
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (searchFrameRef.current) {
      cancelAnimationFrame(searchFrameRef.current);
    }

    // If the value is empty or too short, clear suggestions immediately
    if (!searchValue.trim() || searchValue.trim().length < minQueryLength) {
      setSuggestions([]);
      setIsSearching(false);
      setDebouncedValue('');
      return;
    }

    // Use shorter debounce for shorter queries to feel more responsive
    const queryLength = searchValue.trim().length;
    
    // Adjust debounce times for mobile
    const mobileMultiplier = isMobile ? 1.5 : 1;
    const adaptiveDebounce = queryLength <= 2 ? Math.min(debounceMs, 30 * mobileMultiplier) : 
                            queryLength <= 4 ? Math.min(debounceMs, 45 * mobileMultiplier) : 
                            debounceMs * mobileMultiplier;

    // Only debounce if there's actually a search value
    searchTimeoutRef.current = setTimeout(() => {
      // Use requestAnimationFrame for smoother updates
      searchFrameRef.current = requestAnimationFrame(() => {
        // Only update if this is still the latest search value
        if (latestSearchRef.current === searchValue) {
          setDebouncedValue(searchValue);
        }
      });
    }, adaptiveDebounce);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (searchFrameRef.current) {
        cancelAnimationFrame(searchFrameRef.current);
      }
    };
  }, [searchValue, debounceMs, minQueryLength, isMobile]);

  // Track the latest debounced value for search cancellation
  const latestDebouncedRef = useRef(debouncedValue);
  latestDebouncedRef.current = debouncedValue;

  // Perform search with cancellation and mobile optimization
  useEffect(() => {
    // Clear suggestions if query is too short or empty
    if (!debouncedValue.trim() || debouncedValue.trim().length < minQueryLength) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    // Increment search ID to cancel previous searches
    const currentSearchId = ++searchIdRef.current;
    setIsSearching(true);

    // Use requestAnimationFrame for smoother updates
    const performSearch = () => {
      // Check if this search was cancelled or outdated
      if (currentSearchId !== searchIdRef.current || 
          latestDebouncedRef.current !== debouncedValue) {
        return;
      }

      try {
        // Perform the fuzzy search
        const searchResults = search(debouncedValue, threshold);
        
        // Check again if this search was cancelled or outdated
        if (currentSearchId !== searchIdRef.current || 
            latestDebouncedRef.current !== debouncedValue) {
          return;
        }
        
        // Use requestAnimationFrame for smoother UI updates
        searchFrameRef.current = requestAnimationFrame(() => {
          // Transform and limit results
          const transformedResults = searchResults
            .slice(0, maxSuggestions)
            .map(result => ({
              parcelId: result.parcelId,
              fullAddress: result.fullAddress,
            }));

          setSuggestions(transformedResults);
          setIsSearching(false);
        });
      } catch (error) {
        console.error('[useSearchSuggestions] Search error:', error);
        if (currentSearchId === searchIdRef.current && 
            latestDebouncedRef.current === debouncedValue) {
          setSuggestions([]);
          setIsSearching(false);
        }
      }
    };

    // For very short queries (1-2 chars), execute immediately since they're fast
    // For longer queries, use requestIdleCallback for non-blocking execution
    const queryLength = debouncedValue.trim().length;
    
    let cleanupFunction: (() => void) | undefined;

    if (queryLength <= 2) {
      // Execute immediately for short queries - they're fast and users expect instant feedback
      queueMicrotask(performSearch);
    } else if ('requestIdleCallback' in window && !isMobile) {
      // Use requestIdleCallback only for desktop - it can be problematic on mobile
      const idleCallbackId = (window as any).requestIdleCallback(performSearch, { timeout: 50 });
      cleanupFunction = () => {
        if ('cancelIdleCallback' in window) {
          (window as any).cancelIdleCallback(idleCallbackId);
        }
      };
    } else {
      // Use requestAnimationFrame for mobile or fallback
      searchFrameRef.current = requestAnimationFrame(performSearch);
      cleanupFunction = () => {
        if (searchFrameRef.current) {
          cancelAnimationFrame(searchFrameRef.current);
        }
      };
    }

    // Return cleanup function if one was created
    return cleanupFunction;
  }, [debouncedValue, minQueryLength, search, maxSuggestions, isMobile, threshold]);

  const handleSetSearchValue = useCallback((value: string) => {
    // Cancel any ongoing search by incrementing the search ID
    searchIdRef.current++;
    
    // Cancel any pending animation frames
    if (searchFrameRef.current) {
      cancelAnimationFrame(searchFrameRef.current);
    }
    
    setSearchValue(value);
    
    // Clear suggestions immediately for empty or short queries
    if (!value.trim() || value.trim().length < minQueryLength) {
      setSuggestions([]);
      setIsSearching(false);
    }
  }, [minQueryLength]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      if (searchFrameRef.current) {
        cancelAnimationFrame(searchFrameRef.current);
      }
    };
  }, []);

  return {
    suggestions,
    isLoading: isPairingsLoading || isSearching,
    error,
    searchValue,
    setSearchValue: handleSetSearchValue,
  };
}; 