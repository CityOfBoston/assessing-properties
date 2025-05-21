import React from 'react';
import styles from './SearchBackground.module.scss';
import streetviewImage from '../../assets/streetview.jpg';

interface SearchBackgroundProps {
  children: React.ReactNode;
}

export const SearchBackground: React.FC<SearchBackgroundProps> = ({
  children,
}) => {
  return (
    <div 
      className={styles.background}
      style={{ backgroundImage: `url(${streetviewImage})` }}
    >
      <div className={styles.content}>
        {children}
      </div>
    </div>
  );
};

export default SearchBackground; 