import React from 'react';
import { SearchBarContainer } from '@containers/SearchBarContainer';
import { SearchBackground } from '@components/SearchBackground';
import styles from './PropertySearchPopup.module.scss';

export interface PropertySearchPopupProps {
  onClose: () => void;
  onSelect?: (pid: string, fullAddress: string) => void;
}

export const PropertySearchPopup: React.FC<PropertySearchPopupProps> = ({
  onClose,
  onSelect,
}) => {
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
          <SearchBarContainer onSelect={onSelect} />
        </div>
      </SearchBackground>
    </div>
  );
};

export default PropertySearchPopup; 