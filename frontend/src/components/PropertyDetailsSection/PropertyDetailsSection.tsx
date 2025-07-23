import React from 'react';
import styles from './PropertyDetailsSection.module.scss';

interface PropertyDetailsSectionProps {
  title: string;
  children: React.ReactNode;
  date?: Date; // Optional hidden date prop
}

export default function PropertyDetailsSection({ title, children, date = new Date() }: PropertyDetailsSectionProps) {
  // The date prop is available for logic but not rendered in the DOM
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </div>
  );
} 