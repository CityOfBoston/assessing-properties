import React from 'react';
import styles from './PropertyDetailsSection.module.scss';

interface PropertyDetailsSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function PropertyDetailsSection({ title, children }: PropertyDetailsSectionProps) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{title}</h1>
      {children}
    </div>
  );
} 