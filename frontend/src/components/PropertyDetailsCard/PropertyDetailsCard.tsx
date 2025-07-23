import React from 'react';
import styles from './PropertyDetailsCard.module.scss';

interface PropertyDetailsCardProps {
  icon?: React.ReactNode;
  header: string;
  value: string;
  isGrey?: boolean;
}

const PropertyDetailsCard: React.FC<PropertyDetailsCardProps> = ({
  icon,
  header,
  value,
  isGrey = false,
}) => {
  return (
    <div className={`${styles.card} ${isGrey ? styles.grey : ''}`}>
      <div className={styles.header}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <span className={styles.headerText}>{header}</span>
      </div>
      <div className={styles.value}>{value}</div>
    </div>
  );
};

export default PropertyDetailsCard; 