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
  onSelect,
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const navigate = useNavigate();

  const handlePropertySelect = (pid: string, fullAddress?: string) => {
    // If a custom onSelect handler is provided, use it
    if (onSelect) {
      onSelect(pid, fullAddress || '');
      onClose();
      return;
    }
    
    // Otherwise, use internal navigation
    navigate(`/details?parcelId=${pid}`);
    onClose();
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
          labelText="Search by address or parcel ID"
          tooltipHint="A unique, legal 10 digit number assigned by the City of Boston to each parcel of property."
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