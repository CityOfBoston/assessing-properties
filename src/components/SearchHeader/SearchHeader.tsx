import React, { ReactNode } from 'react';
import styles from './SearchHeader.module.scss';

interface SearchHeaderProps {
  heading: string;
  description: ReactNode;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  heading,
  description,
}) => {
  return (
    <div className={styles.searchHeader}>
      <h1 className={styles.heading}>{heading}</h1>
      <div className={styles.description}>{description}</div>
    </div>
  );
};

export default SearchHeader; 