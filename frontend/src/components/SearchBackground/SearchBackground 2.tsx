import React from 'react';
import styles from './SearchBackground.module.scss';
import streetViewImage from '../../assets/streetview.jpg';

interface SearchBackgroundProps {
  children: React.ReactNode;
}

export const SearchBackground: React.FC<SearchBackgroundProps> = ({
  children
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.overlay} />
      <img 
        src={streetViewImage} 
        alt="" 
        className={styles.backgroundImage}
        aria-hidden="true"
      />
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default SearchBackground; 