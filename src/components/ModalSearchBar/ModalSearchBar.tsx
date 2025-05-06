import React, { useState } from 'react';
import styles from './ModalSearchBar.module.scss';

interface ModalSearchBarProps {
  /**
   * Optional placeholder text for the search input
   */
  placeholder?: string;

  /**
   * Optional handler for search submission
   */
  onSearch?: (searchTerm: string) => void;
}

/**
 * ModalSearchBar component with search heading and input field
 */
export const ModalSearchBar: React.FC<ModalSearchBarProps> = ({
  placeholder = 'Search for a property address...',
  onSearch
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  return (
    <div className={styles.modalSearchBar}>
      <h2 className={styles.searchHeading}>Search</h2>
      
      <section aria-label="Search component">
        <div className={styles.searchContainer}>
          <div className={styles.searchIconWrapper}>
              <img
                src="/node_modules/cob-uswds/dist/img/usa-icons/search.svg"
                className={styles.searchIcon}
                alt=""
              />
            </div>
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
              placeholder={placeholder}
            />
          <button className="usa-button" type="submit">
            <span className="usa-search__submit-text">
              Search
            </span>
            <img
              src="/node_modules/cob-uswds/dist/img/usa-icons/search--white.svg"
              className="usa-search__submit-icon"
              alt="Search"
            />
          </button>
        </form>
        </div>
      </section>
    </div>
  );
};

export default ModalSearchBar; 