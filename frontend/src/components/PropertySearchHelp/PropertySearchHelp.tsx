import React from 'react';
import styles from './PropertySearchHelp.module.scss';

interface SearchTip {
  title: string;
  description: string;
}

interface PropertySearchHelpProps {
  searchQuery: string;
  searchTips: SearchTip[];
  texts?: {
    noResultsTitle?: string;
    noResultsMessage?: string;
    tipsTitle?: string;
  };
}

export const PropertySearchHelp: React.FC<PropertySearchHelpProps> = ({
  searchQuery,
  searchTips,
  texts = {
    noResultsTitle: "No Results Found",
    noResultsMessage: 'We did not find results for "{query}"',
    tipsTitle: "Search Tips"
  }
}) => {
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{texts.noResultsTitle}</h2>
      <p className={styles.queryMessage}>
        {texts.noResultsMessage.replace('{query}', searchQuery)}
      </p>
      
      <h2 className={styles.heading}>{texts.tipsTitle}</h2>
      
      <ul className={styles.tipsList}>
        {searchTips.map((tip, index) => (
          <li key={index} className={styles.tipItem}>
            <div className={styles.iconWrapper}>
              <img 
                src="/cob-uswds/img/usa-icons/arrow_forward.svg" 
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