import React from 'react';
import styles from './PropertySearchHelp.module.scss';

interface SearchTip {
  title: string;
  description: string;
}

interface PropertySearchHelpProps {
  searchQuery: string;
  searchTips: SearchTip[];
}

export const PropertySearchHelp: React.FC<PropertySearchHelpProps> = ({
  searchQuery,
  searchTips,
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>No Results Found</h2>
      <p className={styles.queryMessage}>
        We did not find results for "{searchQuery}"
      </p>
      
      <h2 className={styles.heading}>Search Tips</h2>
      
      <ul className={styles.tipsList}>
        {searchTips.map((tip, index) => (
          <li key={index} className={styles.tipItem}>
            <div className={styles.iconWrapper}>
              <img 
                src="/node_modules/cob-uswds/dist/img/usa-icons/arrow_forward.svg" 
                alt="" 
                className={styles.arrowIcon} 
              />
            </div>
            <div className={styles.tipContent}>
              <p className={styles.tipTitle}>{tip.title}</p>
              <div className="usa-hint">{tip.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PropertySearchHelp; 