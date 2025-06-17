import React from 'react';
import styles from './PropertyDetailsCard.module.scss';

interface PropertyDetailsCardProps {
  icon?: React.ReactNode;
  header: string;
  value: string;
}

const PropertyDetailsCard: React.FC<PropertyDetailsCardProps> = ({
  icon,
  header,
  value,
}) => {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {icon && <div className={styles.icon}>{icon}</div>}
        <span className={styles.headerText}>{header}</span>
      </div>
      <div className={styles.value}>{value}</div>
    </div>
  );
};

export default PropertyDetailsCard; 