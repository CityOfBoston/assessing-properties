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
  feedbackLink?: React.ReactNode;
}

export const PropertySearchHelp: React.FC<PropertySearchHelpProps> = ({
  searchQuery,
  searchTips,
  texts = {
    noResultsTitle: "No Results Found",
    noResultsMessage: 'We did not find results for "{query}"',
    tipsTitle: "Search Tips"
  },
  feedbackLink
}) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>{texts.noResultsTitle}</h1>
      <div className={styles.queryMessageRow}>
        <p className={styles.queryMessage}>
          {texts.noResultsMessage.replace('{query}', searchQuery)}
        </p>
        {feedbackLink && feedbackLink}
      </div>
      
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