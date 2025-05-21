import React from 'react';
import styles from './RecordTable.module.scss';

export interface RecordTableData {
  [key: string]: string | number;
}

interface RecordTableProps {
  data: RecordTableData;
  className?: string;
}

/**
 * RecordTable displays a single record with field names in the first column
 * and values in the second column. Each row represents a different field.
 */
export const RecordTable: React.FC<RecordTableProps> = ({
  data,
  className = '',
}) => {
  if (!data) {
    return null;
  }

  // Extract keys from the data object
  const keys = Object.keys(data);

  return (
    <div className={`${styles.recordTable} ${className}`}>
      <div className={styles.grid}>
        {keys.map((key, index) => (
          <div key={index} className={styles.row}>
            <div className={styles.labelCell}>
              <span className={styles.labelText}>{key}</span>
            </div>
            <div className={styles.valueCell}>
              {data[key]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordTable; 