import React from 'react';
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
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleClear = () => {
    onChange('');
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    }
  };

  return (
    <div className={styles.searchBarContainer}>
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
              className={styles.searchInput}
              id="search-field" 
              type="search" 
              name="search"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholderText}
              aria-label="Search input"
            />
            {value && (
              <button
                type="button"
                className={styles.clearButton}
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

      {(suggestions.length > 0 || loading) && (
        <div className={styles.suggestionsContainer}>
          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.loadingSpinner} />
              <p>Loading suggestions...</p>
            </div>
          ) : (
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
                <p className={styles.fullAddress}>{suggestion.fullAddress}</p>
                <p className={styles.parcelId}>Parcel ID: {suggestion.parcelId}</p>
              </div>
            ))
          )}
        </div>
      )}
      
      {errorMessage && (
        <span className={styles.errorMessage} id="search-error-message" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default AnnotatedSearchBar; 