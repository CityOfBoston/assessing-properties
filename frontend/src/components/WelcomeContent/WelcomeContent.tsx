import React from 'react';
import styles from './WelcomeContent.module.scss';
import assessingLogo from '../../assets/assessing_logo_white.svg';
import { BetaLabel } from '../BetaLabel';

interface WelcomeContentProps {
  additionalContent?: React.ReactNode;
  hideTitleAndDescriptionOnMobile?: boolean;
}

export const WelcomeContent: React.FC<WelcomeContentProps> = ({ 
  additionalContent,
  hideTitleAndDescriptionOnMobile = false 
}) => {
  const titleClassName = `${styles.title} ${hideTitleAndDescriptionOnMobile ? styles.hideOnMobile : ''}`;
  const descriptionClassName = `${styles.description} ${hideTitleAndDescriptionOnMobile ? styles.hideOnMobile : ''}`;

  return (
    <div className={styles.container}>
      <img 
        src={assessingLogo} 
        alt="Assessing Department Logo" 
        className={`${styles.logo} ${hideTitleAndDescriptionOnMobile ? styles.hideOnMobile : ''}`}
      />
      <div className={styles.contentWrapper}>
        <h1 className={titleClassName}>
          Welcome to Properties Assessment <BetaLabel variant="white" />
        </h1>
        {additionalContent && (
          <div className={styles.mobileAdditionalContent}>
            {additionalContent}
          </div>
        )}
        <p className={descriptionClassName}>
          Use this tool to find detailed information about properties in Boston including: assessed value, location, ownership, and tax information for any parcel in the City of Boston.
        </p>
      </div>
      {additionalContent && (
        <div className={styles.desktopAdditionalContent}>
          {additionalContent}
        </div>
      )}
    </div>
  );
};

export default WelcomeContent; 