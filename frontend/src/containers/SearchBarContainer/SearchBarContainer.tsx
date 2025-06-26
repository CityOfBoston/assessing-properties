import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';
import { AnnotatedSearchBar } from '../../components/AnnotatedSearchBar';
import { useCallback, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface SearchBarContainerProps {
  onSelect?: (pid: string, fullAddress: string) => void;
  labelText?: string;
  tooltipHint?: string;
  placeholderText?: string;
  debounceMs?: number;
  onFocus?: () => void;
  onBlur?: () => void;
  onClear?: () => void;
  errorMessage?: string;
  value?: string;
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
  errorMessage,
  value,
}: SearchBarContainerProps) => {
  const navigate = useNavigate();
  const [isFocused, setIsFocused] = useState(false);
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
      onSelect?.(suggestion.parcelId, suggestion.fullAddress);
    } else {
      // Navigate to search results page for all other cases
      console.log('[SearchBarContainer] Navigating to search results for term:', searchTerm);
      navigate(`/search?search=${encodeURIComponent(searchTerm)}`);
    }
  }, [suggestions, onSelect, navigate]);

  const handleSuggestionClick = useCallback((suggestion: { parcelId: string, fullAddress: string }) => {
    console.log('[SearchBarContainer] Suggestion clicked:', suggestion);
    onSelect?.(suggestion.parcelId, suggestion.fullAddress);
  }, [onSelect]);

  const handleInputChange = useCallback((value: string) => {
    console.log('[SearchBarContainer] Input changed:', value);
    setSearchValue(value);
  }, [setSearchValue]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
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
      setIsFocused(false);
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
    parcelId: suggestion.parcelId,
  }));

  // Hide error message when input is focused
  const displayErrorMessage = isFocused ? undefined : (errorMessage || error?.message);

  console.log('[SearchBarContainer] Rendering with:', {
    suggestionsCount: transformedSuggestions.length,
    isLoading,
    hasError: !!error,
    isFocused
  });

  return (
    <AnnotatedSearchBar
      labelText={labelText}
      tooltipHint={tooltipHint}
      placeholderText={placeholderText}
      value={value || searchValue}
      onChange={handleInputChange}
      onSuggestionClick={handleSuggestionClick}
      suggestions={transformedSuggestions}
      loading={isLoading}
      errorMessage={displayErrorMessage}
      onSearch={handleSearch}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onClear={handleClear}
      inputRef={inputRef}
    />
  );
}; 