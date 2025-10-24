import React from 'react';
import styles from './PropertyDetailsSection.module.scss';

interface PropertyDetailsSectionProps {
  title: string;
  children: React.ReactNode;
}

function PropertyDetailsSection({ title, children }: PropertyDetailsSectionProps, ref: React.ForwardedRef<HTMLDivElement>) {
  return (
    <div ref={ref} className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </div>
  );
}

const ForwardedPropertyDetailsSection = React.memo(
  React.forwardRef<HTMLDivElement, PropertyDetailsSectionProps>(PropertyDetailsSection)
);

ForwardedPropertyDetailsSection.displayName = 'PropertyDetailsSection';

export default ForwardedPropertyDetailsSection;