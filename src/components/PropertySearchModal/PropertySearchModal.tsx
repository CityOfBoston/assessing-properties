import React, { useState } from 'react';
import styles from './PropertySearchModal.module.scss';
import IconButton from '../IconButton';
import ModalSearchBar from '../ModalSearchBar';

interface PropertySearchModalProps {
  /**
   * Title to display at the top of the modal
   */
  title?: string;
  
  /**
   * Optional search results component to display below the search bar
   */
  searchResultsComponent?: React.ReactNode;
  
  /**
   * Optional help component to display when no search results are available
   */
  searchHelpComponent?: React.ReactNode;
  
  /**
   * Flag to indicate if search results should be shown
   */
  showResults?: boolean;
  
  /**
   * Optional handler for search submission
   */
  onSearch?: (searchTerm: string) => void;
}

/**
 * PropertySearchModal component that displays a search modal with customizable content
 */
export const PropertySearchModal: React.FC<PropertySearchModalProps> = ({
  title = 'Assessing',
  searchResultsComponent,
  searchHelpComponent,
  showResults = false,
  onSearch
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => {
    setIsModalOpen(true);
    document.body.classList.add('modal-open');
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    document.body.classList.remove('modal-open');
  };
  
  // Handle backdrop click to close the modal
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };
  
  // Handle search submission
  const handleSearch = (searchTerm: string) => {
    if (onSearch) {
      onSearch(searchTerm);
    }
  };
  
  // Icon for the search button
  const SearchIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
    </svg>
  );
  
  return (
    <>
      {/* Button to open the modal */}
      <IconButton 
        icon={<img src="/node_modules/cob-uswds/dist/img/usa-icons/search.svg" alt="" />}
        text="Search another property"
        onClick={openModal}
      />
      
      {/* Modal overlay */}
      {isModalOpen && (
        <div className={styles.modalBackdrop} onClick={handleBackdropClick}>
          <div className={styles.modalContent}>
            <button 
              className={styles.closeButton} 
              aria-label="Close modal"
              onClick={closeModal}
            >
              &times;
            </button>
            
            <div className={styles.modalBody}>
              {/* Header with logo and title */}
              <div className={styles.modalHeader}>
                <img 
                  src="/src/assets/assessing_logo.svg" 
                  alt="" 
                  className={styles.logo}
                />
                <h2 className={styles.title}>{title}</h2>
              </div>
              
              {/* Search bar */}
              <div className={styles.searchBarContainer}>
                <ModalSearchBar onSearch={handleSearch} />
              </div>
              
              {/* Divider */}
              <div className={styles.divider}></div>
              
              {/* Content area - either search results or help */}
              <div className={styles.contentArea}>
                {showResults ? searchResultsComponent : searchHelpComponent}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PropertySearchModal; 