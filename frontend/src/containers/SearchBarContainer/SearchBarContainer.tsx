import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';
import { AnnotatedSearchBar } from '../../components/AnnotatedSearchBar';
import { useCallback, useRef } from 'react';

interface SearchBarContainerProps {
  onSelect?: (pid: string, fullAddress: string) => void;
  labelText?: string;
  tooltipHint?: string;
  placeholderText?: string;
  debounceMs?: number;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
}

export const SearchBarContainer = ({
  onSelect,
  labelText = 'Search for a property',
  tooltipHint = 'Enter an address or parcel ID to search',
  placeholderText = 'Enter address or parcel ID',
  debounceMs = 300,
  onFocus,
  onBlur,
  onClear,
}: SearchBarContainerProps) => {
  const {
    suggestions,
    isLoading,
    error,
    searchValue,
    setSearchValue,
  } = useSearchSuggestions({ debounceMs });

  const isClearing = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = useCallback((searchTerm: string) => {
    console.log('[SearchBarContainer] Search triggered with term:', searchTerm);
    
    if (!searchTerm.trim()) {
      console.log('[SearchBarContainer] Empty search term, ignoring');
      return;
    }

    // If there's exactly one suggestion and it matches the search term closely
    if (suggestions.length === 1) {
      const suggestion = suggestions[0];
      console.log('[SearchBarContainer] Single suggestion found, selecting:', suggestion);
      onSelect?.(suggestion.pid, suggestion.fullAddress);
    } else if (suggestions.length > 1) {
      console.log('[SearchBarContainer] Multiple suggestions found:', suggestions.length);
    } else {
      console.log('[SearchBarContainer] No suggestions found for term:', searchTerm);
    }
  }, [suggestions, onSelect]);

  const handleSuggestionClick = useCallback((suggestion: { parcelId: string, fullAddress: string }) => {
    console.log('[SearchBarContainer] Suggestion clicked:', suggestion);
    onSelect?.(suggestion.parcelId, suggestion.fullAddress);
  }, [onSelect]);

  const handleInputChange = useCallback((value: string) => {
    console.log('[SearchBarContainer] Input changed:', value);
    setSearchValue(value);
  }, [setSearchValue]);

  const handleFocus = useCallback(() => {
    isClearing.current = false;
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    // Check if the related target is the clear button
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (relatedTarget?.classList.contains('clearButton')) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if (!isClearing.current) {
      onBlur?.();
    }
  }, [onBlur]);

  const handleClear = useCallback(() => {
    isClearing.current = true;
    setSearchValue('');
    onClear?.();
    // Refocus the input after clearing
    inputRef.current?.focus();
    // Reset the clearing flag after a short delay
    setTimeout(() => {
      isClearing.current = false;
    }, 100);
  }, [setSearchValue, onClear]);

  // Transform suggestions to match AnnotatedSearchBar interface
  const transformedSuggestions = suggestions.map(suggestion => ({
    fullAddress: suggestion.fullAddress,
    parcelId: suggestion.pid,
  }));

  console.log('[SearchBarContainer] Rendering with:', {
    suggestionsCount: transformedSuggestions.length,
    isLoading,
    hasError: !!error
  });

  return (
    <AnnotatedSearchBar
      labelText={labelText}
      tooltipHint={tooltipHint}
      placeholderText={placeholderText}
      value={searchValue}
      onChange={handleInputChange}
      onSuggestionClick={handleSuggestionClick}
      suggestions={transformedSuggestions}
      loading={isLoading}
      errorMessage={error?.message}
      onSearch={handleSearch}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClear={handleClear}
      inputRef={inputRef}
    />
  );
}; 