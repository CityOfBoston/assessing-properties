import React from 'react';
import styles from './WelcomeContent.module.scss';
import assessingLogo from '../../assets/assessing_logo_white.svg';

export const WelcomeContent: React.FC = () => {
  return (
    <div className={styles.container}>
      <img 
        src={assessingLogo} 
        alt="Assessing Department Logo" 
        className={styles.logo}
      />
      <h1 className={styles.title}>Welcome to Properties</h1>
      <p className={styles.description}>
      Find detailed information about properties in Boston. Whether you're a 
      homeowner, business owner, researcher, or real estate or legal 
      professional, use this tool to find assessed value, location, 
      ownership, and tax information for any parcel in the city.
      </p>
    </div>
  );
};

export default WelcomeContent; 