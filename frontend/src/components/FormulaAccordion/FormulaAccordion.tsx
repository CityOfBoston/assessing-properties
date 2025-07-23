import React, { useState, useEffect } from 'react';
import styles from './FormulaAccordion.module.scss';
import MessageBox from '../MessageBox';

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
  const headerRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // Expand all by default on mount or when drawerOptions changes
  useEffect(() => {
    setExpandedIndices(drawerOptions.map((_, idx) => idx));
  }, [drawerOptions]);

  const toggleDrawer = (index: number) => {
    setExpandedIndices(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Keyboard navigation for headers
  const handleHeaderKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    const lastIndex = drawerOptions.length - 1;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (drawerOptions[index].message || drawerOptions[index].description) {
        toggleDrawer(index);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = index === lastIndex ? 0 : index + 1;
      headerRefs.current[next]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = index === 0 ? lastIndex : index - 1;
      headerRefs.current[prev]?.focus();
    }
  };

  return (
    <div className={styles.accordion} role="presentation">
      {drawerOptions.map((option, index) => {
        const isExpanded = expandedIndices.includes(index);
        const panelId = `accordion-panel-${index}`;
        const headerId = `accordion-header-${index}`;
        return (
          <div key={index} className={styles.drawer}>
            <div
              className={styles.header}
              id={headerId}
              ref={el => (headerRefs.current[index] = el)}
              role="button"
              tabIndex={0}
              aria-expanded={isExpanded}
              aria-controls={panelId}
              aria-disabled={!(option.message || option.description)}
              onClick={() => (option.message || option.description) && toggleDrawer(index)}
              onKeyDown={e => handleHeaderKeyDown(e, index)}
            >
              <div className={styles.title}>{option.title}</div>
              <div className={styles.rightContent}>
                <div className={styles.value}>{option.value}</div>
                {(option.message || option.description) && (
                  <img
                    src="/cob-uswds/img/usa-icons/expand_more.svg"
                    alt={isExpanded ? 'Collapse section' : 'Expand section'}
                    className={`${styles.arrow} ${isExpanded ? styles.expanded : ''}`}
                  />
                )}
              </div>
            </div>
            {isExpanded && (option.message || option.description) && (
              <div
                className={styles.content}
                id={panelId}
                role="region"
                aria-labelledby={headerId}
              >
                {option.message && (
                  <MessageBox>
                    {option.message}
                  </MessageBox>
                )}
                {option.description && (
                  <div className={styles.description}>
                    {option.description}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default FormulaAccordion; 