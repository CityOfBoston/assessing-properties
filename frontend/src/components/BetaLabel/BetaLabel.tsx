import React from 'react';
import styles from './BetaLabel.module.scss';

export interface BetaLabelProps {
  className?: string;
  variant?: 'blue' | 'white';
}

export const BetaLabel: React.FC<BetaLabelProps> = ({ className, variant = 'blue' }) => {
  const variantClass = variant === 'white' ? styles.white : styles.blue;
  
  return (
    <span className={`${styles.betaLabel} ${variantClass} ${className || ''}`}>
      BETA
    </span>
  );
};

export default BetaLabel;