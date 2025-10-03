import React, { useRef, useEffect, useState } from 'react';
import styles from './AnnotatedSearchBar.module.scss';
import Tooltip from '../Tooltip';

interface Suggestion {
  fullAddress: string;
  parcelId: string;
}

interface AnnotatedSearchBarProps {
  // Main content
  labelText: string;
  tooltipHint: string;
  placeholderText?: string;
  errorMessage?: string;
  value: string;
  
  // Button text
  searchButtonText?: string;
  clearButtonText?: string;
  cancelButtonText?: string;
  
  // Loading states
  loadingText?: string;
  noResultsText?: string;
  parcelIdPrefix?: string;
  
  // Aria labels
  searchInputAriaLabel?: string;
  clearButtonAriaLabel?: string;
  searchButtonAriaLabel?: string;
  suggestionsAriaLabel?: string;
  modalAriaLabel?: string;
  closeModalAriaLabel?: string;
  
  // Functional props
  onChange: (value: string) => void;
  suggestions: Suggestion[];
  loading?: boolean;
  onSearch: (searchTerm: string) => void;
  onSuggestionClick?: (suggestion: Suggestion) => void;
  onFocus?: () => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  showSuggestions?: boolean;
}

export const AnnotatedSearchBar: React.FC<AnnotatedSearchBarProps> = ({
  // Main content
  labelText,
  tooltipHint,
  placeholderText,
  errorMessage,
  value,
  
  // Button text
  searchButtonText,
  clearButtonText,
  cancelButtonText,
  
  // Loading states
  loadingText,
  noResultsText,
  parcelIdPrefix,
  
  // Aria labels
  searchInputAriaLabel,
  clearButtonAriaLabel,
  searchButtonAriaLabel,
  suggestionsAriaLabel,
  modalAriaLabel,
  closeModalAriaLabel,
  
  // Functional props
  onChange,
  suggestions = [],
  loading = false,
  onSearch,
  onSuggestionClick,
  onFocus,
  onBlur,
  onClear,
  inputRef: externalInputRef,
  showSuggestions = true,
}) => {
  const searchBarRef = useRef<HTMLDivElement>(null);
  const [searchBarBottom, setSearchBarBottom] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const internalInputRef = useRef<HTMLInputElement>(null);
  const inputRef = externalInputRef || internalInputRef;
  const ignoreNextFocus = useRef(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [suggestions]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions || loading || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > -1 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleSuggestionClick(suggestions[selectedIndex]);
        } else {
          handleSubmit(e);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Check if we're on mobile and handle resize
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Close modal if switching from mobile to desktop
      if (!mobile && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    window.addEventListener('orientationchange', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('orientationchange', checkMobile);
    };
  }, [isModalOpen]);

  const handleModalOpen = () => {
    if (isMobile) {
      setIsModalOpen(true);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    inputRef.current?.blur();
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        handleModalClose();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = ''; // Restore scroll
    };
  }, [isModalOpen]);

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

    // Also update position on input focus (for mobile keyboard)
    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', updatePosition);
    }

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
      if (input) {
        input.removeEventListener('focus', updatePosition);
      }
    };
  }, [inputRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
    if (isMobile) {
      handleModalClose();
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClear?.();
  };

  const handleSuggestionClick = (suggestion: Suggestion, event?: React.MouseEvent | React.KeyboardEvent) => {
    console.log('[AnnotatedSearchBar] handleSuggestionClick called with:', suggestion);
    console.log('[AnnotatedSearchBar] Event type:', event?.type);
    console.log('[AnnotatedSearchBar] onSuggestionClick function:', onSuggestionClick);
    
    if (onSuggestionClick) {
      onSuggestionClick(suggestion);
    } else {
      console.warn('[AnnotatedSearchBar] No onSuggestionClick function provided');
    }
    
    if (isMobile) {
      handleModalClose();
    }
  };

  const handleInputFocus = () => {
    if (ignoreNextFocus.current) {
      ignoreNextFocus.current = false;
      return;
    }
    if (isMobile) {
      handleModalOpen();
    }
    onFocus?.();
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    // Only call onBlur if we're not in modal mode
    if (!isModalOpen) {
      onBlur?.(e);
    }
  };

  return (
    <>
    <div className={styles.searchBarContainer} ref={searchBarRef}>
      <div className={styles.labelContainer}>
        <label className={styles.label} id="search-label" htmlFor="search-field">
          {labelText}
          <span className={styles.tooltipWrapper}>
            <Tooltip hint={tooltipHint} variant="white" />
          </span>
        </label>
      </div>
      
      <section aria-label="Search component">
        <form className={styles.searchForm} role="search" onSubmit={handleSubmit}>
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
              aria-label={searchInputAriaLabel}
              aria-expanded={showSuggestions && suggestions.length > 0}
              aria-controls="search-suggestions"
              aria-activedescendant={selectedIndex >= 0 ? `suggestion-${selectedIndex}` : undefined}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              role="combobox"
              aria-autocomplete="list"
            />
            {value && (
              <button
                type="button"
                className={`${styles.clearButton} clearButton`}
                onClick={handleClear}
                onMouseDown={e => {
                  ignoreNextFocus.current = true;
                  e.preventDefault();
                }}
                aria-label={clearButtonAriaLabel}
                tabIndex={0}
              >
                {clearButtonText}
              </button>
            )}
          </div>
          <button 
            className={styles.searchButton} 
            type="submit"
            aria-label={searchButtonAriaLabel}
          >
              <img
                src="/cob-uswds/img/usa-icons/search.svg"
                alt=""
                className={styles.searchButtonIcon}
                aria-hidden="true"
              />
              <span className={styles.searchButtonText}>{searchButtonText}</span>
          </button>
        </form>
      </section>

        {/* Desktop suggestions */}
        {!isMobile && (
      <div 
        id="search-suggestions"
        className={styles.suggestionsContainer}
        style={{ '--search-bar-bottom': `${searchBarBottom}px` } as React.CSSProperties}
        role="listbox"
        aria-label="Search suggestions"
      >
            {showSuggestions && (loading ? (
          <div className={styles.loadingContainer} role="status">
            <div className={styles.loadingSpinner} aria-hidden="true" />
            <p className={styles.loadingText}>{loadingText}</p>
          </div>
        ) : suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <div 
              key={`${suggestion.parcelId}-${index}`} 
              id={`suggestion-${index}`}
              className={`${styles.suggestionItem} ${selectedIndex === index ? styles.selected : ''}`}
              onMouseDown={(e) => handleSuggestionClick(suggestion, e)}
              onMouseEnter={() => setSelectedIndex(index)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSuggestionClick(suggestion, e);
                }
              }}
              role="option"
              aria-selected={selectedIndex === index}
              tabIndex={0}
            >
              <div className={styles.suggestionContent}>
                <img src="/cob-uswds/img/usa-icons/location_on.svg" alt="" className={styles.locationIcon} aria-hidden="true" />
                <div className={styles.addressContainer}>
                  <p className={styles.fullAddress}>{suggestion.fullAddress}</p>
                  <p className={styles.parcelId}>{parcelIdPrefix}{suggestion.parcelId}</p>
                </div>
              </div>
            </div>
          ))
            ) : value.trim().length >= 1 ? (
              <div className={styles.loadingContainer} role="status">
                <p className={styles.loadingText}>{noResultsText}</p>
              </div>
            ) : null)}
      </div>
        )}
      
      {errorMessage && (
        <span className={styles.errorMessage} id="search-error-message" role="alert">
          {errorMessage}
        </span>
      )}
    </div>

      {/* Mobile full-screen modal */}
      {isMobile && isModalOpen && (
        <div 
          className={styles.mobileModal}
          role="dialog"
          aria-label={modalAriaLabel}
        >
          <div className={styles.modalBackdrop} onClick={handleModalClose} />
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <button 
                type="button" 
                className={styles.modalCloseButton}
                onClick={handleModalClose}
                aria-label={closeModalAriaLabel}
              >
                {cancelButtonText}
              </button>
            </div>
            
            <div className={styles.modalSearchContainer}>
              <form className={styles.modalSearchForm} onSubmit={handleSubmit}>
                <div className={styles.inputWrapper}>
                  <input 
                    className={styles.modalSearchInput}
                    type="search" 
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholderText}
                    autoFocus
                    aria-label={modalAriaLabel}
                    aria-expanded={showSuggestions && suggestions.length > 0}
                    aria-controls="modal-search-suggestions"
                    aria-activedescendant={selectedIndex >= 0 ? `modal-suggestion-${selectedIndex}` : undefined}
                    onKeyDown={handleKeyDown}
                    role="combobox"
                    aria-autocomplete="list"
                  />
                  {value && (
                    <button
                      type="button"
                      className={`${styles.clearButton} clearButton`}
                      onClick={handleClear}
                      onMouseDown={e => e.preventDefault()}
                      aria-label={clearButtonAriaLabel}
                      tabIndex={0}
                    >
                      {clearButtonText}
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div 
              id="modal-search-suggestions"
              className={styles.modalSuggestions}
              role="listbox"
              aria-label={suggestionsAriaLabel}
            >
              {loading ? (
                <div className={styles.loadingContainer} role="status">
                  <div className={styles.loadingSpinner} aria-hidden="true" />
                  <p className={styles.loadingText}>{loadingText}</p>
                </div>
              ) : suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div 
                    key={`modal-${suggestion.parcelId}-${index}`} 
                    id={`modal-suggestion-${index}`}
                    className={`${styles.modalSuggestionItem} ${selectedIndex === index ? styles.selected : ''}`}
                    onClick={() => handleSuggestionClick(suggestion)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSuggestionClick(suggestion);
                      }
                    }}
                    role="option"
                    aria-selected={selectedIndex === index}
                    tabIndex={0}
                  >
                    <div className={styles.suggestionContent}>
                      <img src="/cob-uswds/img/usa-icons/location_on.svg" alt="" className={styles.locationIcon} aria-hidden="true" />
                      <div className={styles.addressContainer}>
                        <p className={styles.fullAddress}>{suggestion.fullAddress}</p>
                        <p className={styles.parcelId}>{parcelIdPrefix}{suggestion.parcelId}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : value.trim().length >= 1 ? (
                <div className={styles.loadingContainer} role="status">
                  <p className={styles.loadingText}>{noResultsText}</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AnnotatedSearchBar; 