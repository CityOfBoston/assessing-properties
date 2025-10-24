import React, { useState } from 'react';
import { SearchBarContainer } from '@containers/SearchBarContainer';
import { SearchBackground } from '@components/SearchBackground';
import styles from './PropertySearchPopup.module.scss';
import { useNavigate } from 'react-router-dom';

export interface PropertySearchPopupProps {
  onClose: () => void;
  onSelect?: (pid: string, fullAddress: string) => void;
  texts?: {
    closeButtonAriaLabel?: string;
    labelText?: string;
    tooltipHint?: string;
    placeholderText?: string;
  };
}

export const PropertySearchPopup: React.FC<PropertySearchPopupProps> = ({
  onClose,
  onSelect,
  texts
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
        id="search_popup_close_button"
        className={styles.closeButton}
        onClick={onClose}
        aria-label={texts.closeButtonAriaLabel}
      >
        ×
      </button>
      <SearchBackground>
        <div className={styles.content}>
          <SearchBarContainer onSelect={handlePropertySelect} 
          labelText={texts.labelText}
          tooltipHint={texts.tooltipHint}
          placeholderText={texts.placeholderText}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          />
        </div>
      </SearchBackground>
    </div>
  );
};

export default PropertySearchPopup; 