import React, { useState } from 'react';
import { SearchBarContainer } from '@containers/SearchBarContainer';
import { SearchBackground } from '@components/SearchBackground';
import styles from './PropertySearchPopup.module.scss';
import { useNavigate } from 'react-router-dom';

export interface PropertySearchPopupProps {
  onClose: () => void;
  onSelect?: (pid: string, fullAddress: string) => void;
}

export const PropertySearchPopup: React.FC<PropertySearchPopupProps> = ({
  onClose,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handlePropertySelect = (pid: string) => {
    // Navigate to property details page
    navigate(`/details?parcelId=${pid}`);
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.closeButton}
        onClick={onClose}
        aria-label="Close search"
      >
        ×
      </button>
      <SearchBackground>
        <div className={styles.content}>
          <SearchBarContainer onSelect={handlePropertySelect} 
          labelText="Search for a property"
          tooltipHint="Enter an address or parcel ID to search"
          placeholderText="Enter address or parcel ID"
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </SearchBackground>
    </div>
  );
};

export default PropertySearchPopup; 