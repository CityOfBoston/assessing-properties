import React, { useState } from 'react';
import styles from './FormulaAccordion.module.scss';

interface DrawerOption {
  title: React.ReactNode;
  value: React.ReactNode;
  message?: React.ReactNode;
  description?: React.ReactNode;
}

interface FormulaAccordionProps {
  drawerOptions: DrawerOption[];
}

const FormulaAccordion: React.FC<FormulaAccordionProps> = ({ drawerOptions }) => {
  const [expandedIndices, setExpandedIndices] = useState<number[]>([]);

  const toggleDrawer = (index: number) => {
    setExpandedIndices(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className={styles.accordion}>
      {drawerOptions.map((option, index) => (
        <div key={index} className={styles.drawer}>
          <div 
            className={styles.header}
            onClick={() => (option.message || option.description) && toggleDrawer(index)}
          >
            <div className={styles.title}>{option.title}</div>
            <div className={styles.rightContent}>
              <div className={styles.value}>{option.value}</div>
              {(option.message || option.description) && (
                <img 
                  src="/cob-uswds/img/usa-icons/expand_more.svg" 
                  alt="Expand"
                  className={`${styles.arrow} ${expandedIndices.includes(index) ? styles.expanded : ''}`}
                />
              )}
            </div>
          </div>
          {expandedIndices.includes(index) && (option.message || option.description) && (
            <div className={styles.content}>
              {option.message && (
                <div className={styles.message}>
                  {option.message}
                </div>
              )}
              {option.description && (
                <div className={styles.description}>
                  {option.description}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FormulaAccordion; 