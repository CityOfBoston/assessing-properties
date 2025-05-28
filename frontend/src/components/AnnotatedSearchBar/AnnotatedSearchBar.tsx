import React, { useRef, useEffect, useState } from 'react';
import styles from './AnnotatedSearchBar.module.scss';
import Tooltip from '../Tooltip';

interface Suggestion {
  fullAddress: string;
  parcelId: string;
}

interface AnnotatedSearchBarProps {
  labelText: string;
  tooltipHint: string;
  placeholderText?: string;
  errorMessage?: string;
  value: string;
  onChange: (value: string) => void;
  suggestions: Suggestion[];
  loading?: boolean;
  onSearch: (searchTerm: string) => void;
  onSuggestionClick?: (suggestion: Suggestion) => void;
  onFocus?: () => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

export const AnnotatedSearchBar: React.FC<AnnotatedSearchBarProps> = ({
  labelText,
  tooltipHint,
  placeholderText,
  errorMessage,
  value,
  onChange,
  suggestions = [],
  loading = false,
  onSearch,
  onSuggestionClick,
  onFocus,
  onBlur,
  onClear,
  inputRef: externalInputRef,
}) => {
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [searchBarBottom, setSearchBarBottom] = useState(0);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef || internalInputRef;

  useEffect(() => {
    const updatePosition = () => {
      if (searchBarRef.current) {
        const rect = searchBarRef.current.getBoundingClientRect();
        setSearchBarBottom(rect.bottom);
      }
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClear?.();
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  return (
    <div className={styles.searchBarContainer} ref={searchBarRef}>
      <div className={styles.labelContainer}>
        <label className={styles.label} id="search-label" htmlFor="property-search">
          {labelText}
          <span className={styles.tooltipWrapper}>
            <Tooltip hint={tooltipHint} variant="white" />
          </span>
        </label>
      </div>
      
      <section aria-label="Search component">
        <form className={styles.searchForm} role="search" onSubmit={handleSubmit}>
          <label className="usa-sr-only" htmlFor="search-field">
            Search
          </label>
          <div className={styles.inputWrapper}>
            <input 
              ref={inputRef}
              className={styles.searchInput}
              id="search-field" 
              type="search" 
              name="search"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholderText}
              aria-label="Search input"
              onFocus={onFocus}
              onBlur={onBlur}
            />
            {value && (
              <button
                type="button"
                className={`${styles.clearButton} clearButton`}
                onClick={handleClear}
                aria-label="Clear search"
                tabIndex={0}
              >
                ×
              </button>
            )}
          </div>
          <button 
            className={styles.searchButton} 
            type="submit"
            aria-label="Submit search"
          >
            Search
          </button>
        </form>
      </section>

      <div 
        className={styles.suggestionsContainer}
        style={{ '--search-bar-bottom': `${searchBarBottom}px` } as React.CSSProperties}
      >
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner} />
            <p>Loading suggestions...</p>
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <div 
              key={`${suggestion.parcelId}-${index}`} 
              className={styles.suggestionItem}
              onClick={() => handleSuggestionClick(suggestion)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleSuggestionClick(suggestion);
                }
              }}
              role="button"
              tabIndex={0}
            >
              <div className={styles.suggestionContent}>
                <img src="/cob-uswds/img/usa-icons/location_on.svg" alt="" className={styles.locationIcon} />
                <div className={styles.addressContainer}>
                  <p className={styles.fullAddress}>{suggestion.fullAddress}</p>
                  <p className={styles.parcelId}>Parcel ID: {suggestion.parcelId}</p>
                </div>
              </div>
            </div>
          ))
        ) : null}
      </div>
      
      {errorMessage && (
        <span className={styles.errorMessage} id="search-error-message" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default AnnotatedSearchBar; 