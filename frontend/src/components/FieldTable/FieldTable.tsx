import React from 'react';
import styles from './FieldTable.module.scss';

export interface FieldTableData {
  [key: string]: string | number | React.ReactNode;
}

interface FieldTableProps {
  data: FieldTableData[];
  className?: string;
}

/**
 * FieldTable displays data in a traditional table format with column headers.
 * Each row represents a record, and each column represents a field.
 */
export const FieldTable: React.FC<FieldTableProps> = ({
  data,
  className = '',
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  // Extract keys from the first data item to use as headers
  const keys = Object.keys(data[0]);

  return (
    <div className={`${styles.fieldTable} ${className}`}>
      <div className={styles.grid}>
        {/* Header Row */}
        <div className={styles.headerRow}>
          {keys.map((key) => (
            <div key={key} className={styles.headerCell}>
              <h3 className={styles.headerText}>{key}</h3>
            </div>
          ))}
        </div>

        {/* Data Rows */}
        {data.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.row}>
            {keys.map((key) => (
              <div key={`${rowIndex}-${key}`} className={styles.cell}>
                {row[key]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FieldTable; 