import React from 'react';
import styles from './RecordTable.module.scss';

export interface RecordTableData {
  [key: string]: string | number | React.ReactNode;
}

interface RecordTableProps {
  data: RecordTableData;
  className?: string;
  rowIndex?: number;
  activeRowIndex?: number | null;
  setActiveRowIndex?: (idx: number | null) => void;
  openedRowIndex?: number | null;
  setOpenedRowIndex?: (idx: number | null) => void;
}

/**
 * RecordTable displays a single record with field names in the first column
 * and values in the second column. Each row represents a different field.
 */
export const RecordTable: React.FC<RecordTableProps> = ({
  data,
  className = '',
  rowIndex = 0,
  activeRowIndex = null,
  setActiveRowIndex,
  openedRowIndex = null,
  setOpenedRowIndex,
}) => {
  if (!data) {
    return null;
  }

  // Extract keys from the data object
  const keys = Object.keys(data);
  const isActive = activeRowIndex === rowIndex;
  const isOpened = openedRowIndex === rowIndex;

  return (
    <div
      className={`${styles.recordTable} ${className} ${isActive ? styles.activeRow : ''}`}
      tabIndex={0}
      role="button"
      aria-expanded={isOpened}
      onFocus={() => setActiveRowIndex && setActiveRowIndex(rowIndex)}
      onBlur={() => setActiveRowIndex && setActiveRowIndex(null)}
      onMouseEnter={() => setActiveRowIndex && setActiveRowIndex(rowIndex)}
      onMouseLeave={() => setActiveRowIndex && setActiveRowIndex(null)}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && setOpenedRowIndex) {
          setOpenedRowIndex(rowIndex);
          e.preventDefault();
        } else if (e.key === 'Escape' && setOpenedRowIndex) {
          setOpenedRowIndex(null);
          e.preventDefault();
        }
      }}
    >
      <div className={styles.grid}>
        {keys.map((key, index) => {
          const value = data[key];
          if (
            React.isValidElement(value) &&
            value.type === 'a'
          ) {
            return (
              <div key={index} className={styles.row}>
                <div className={styles.labelCell}>
                  <span className={styles.labelText}>{key}</span>
                </div>
                <div className={styles.valueCell}>
                  {React.cloneElement(
                    value as React.ReactElement<HTMLAnchorElement>,
                    {
                      tabIndex: isOpened ? 0 : -1,
                      'aria-hidden': (!isOpened).toString(),
                    } as any
                  )}
                </div>
              </div>
            );
          }
          return (
            <div key={index} className={styles.row}>
              <div className={styles.labelCell}>
                <span className={styles.labelText}>{key}</span>
              </div>
              <div className={styles.valueCell}>
                {value}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecordTable; 