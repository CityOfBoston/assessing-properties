import React from 'react';
import styles from './BetaLabel.module.scss';

export interface BetaLabelProps {
  className?: string;
  variant?: 'blue' | 'white';
  text?: string;
}

export const BetaLabel: React.FC<BetaLabelProps> = ({ className, variant = 'blue', text = 'BETA' }) => {
  const variantClass = variant === 'white' ? styles.white : styles.blue;
  
  return (
    <span className={`${styles.betaLabel} ${variantClass} ${className || ''}`}>
      {text}
    </span>
  );
};

export default BetaLabel;