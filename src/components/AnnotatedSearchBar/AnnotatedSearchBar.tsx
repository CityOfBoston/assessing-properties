import React, { useState } from 'react';
import styles from './AnnotatedSearchBar.module.scss';
import Tooltip from '../Tooltip';

interface AnnotatedSearchBarProps {
  labelText: string;
  tooltipHint: string;
  searchHint: string;
  placeholderText: string;
  errorMessage?: string;
  onSearch: (searchTerm: string) => void;
}

export const AnnotatedSearchBar: React.FC<AnnotatedSearchBarProps> = ({
  labelText,
  tooltipHint,
  searchHint,
  placeholderText,
  errorMessage,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.labelContainer}>
        <label className="usa-label" id="search-label" htmlFor="property-search">
          {labelText}
          <span className={styles.tooltipWrapper}>
            <Tooltip hint={tooltipHint} />
          </span>
        </label>
      </div>
      
      <div className="usa-hint" id="search-hint">
        {searchHint}
      </div>
      
      <section aria-label="Search component">
        <form className="usa-search" role="search" onSubmit={handleSubmit}>
          <label className="usa-sr-only" htmlFor="search-field">
            Search
          </label>
          <input 
            className="usa-input" 
            id="search-field" 
            type="search" 
            name="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholderText}
          />
          <button className="usa-button" type="submit">
            <span className="usa-search__submit-text">
              Search
            </span>
            <img
              src="/node_modules/cob-uswds/dist/img/usa-icons/search.svg"
              className="usa-search__submit-icon"
              alt="Search"
            />
          </button>
        </form>
      </section>
      
      {errorMessage && (
        <span className="usa-error-message" id="search-error-message" role="alert">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default AnnotatedSearchBar; 