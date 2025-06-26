import React from 'react';
import FieldTable from '@components/FieldTable';
import RecordTable from '@components/RecordTable';
import styles from './ResponsiveTable.module.scss';

export interface TableData {
  [key: string]: string | number | React.ReactNode;
}

interface ResponsiveTableProps {
  data: TableData[];
  showDetails?: boolean;
  showMapLink?: boolean;
}

/**
 * ResponsiveTable displays data in either a FieldTable (desktop) or RecordTable (mobile) format
 * based on screen size. It automatically handles the responsive switching between views.
 */
export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  data,
  showDetails = false,
  showMapLink = false,
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  const processedData = data.map(row => {
    const newRow = { ...row };
    if (showDetails) {
      const parcelId = row['Parcel ID'] as string;
      const detailsLink = (
        <a
          className="usa-link usa-link--external"
          rel="noreferrer"
          target="_blank"
          href={`#/details?parcelId=${parcelId}`}
        >
          View Details
        </a>
      );

      // For desktop view (FieldTable), split into separate columns
      if (showMapLink) {
        newRow['Details'] = detailsLink;
        newRow[''] = (
          <a
            className="usa-link usa-link--external"
            rel="noreferrer"
            target="_blank"
            href={`https://app01.cityofboston.gov/AssessingMap/?find=${parcelId}`}
          >
            Open in Map
          </a>
        );
      } else {
        newRow['Details'] = detailsLink;
      }
    }
    return newRow;
  });

  // For mobile view (RecordTable), combine the links
  const mobileData = processedData.map(row => {
    const newRow = { ...row };
    if (showDetails && showMapLink) {
      const parcelId = row['Parcel ID'] as string;
      newRow['Details'] = (
        <div className={styles.detailsLinks}>
          <a
            className="usa-link usa-link--external"
            rel="noreferrer"
            target="_blank"
            href={`#/details?parcelId=${parcelId}`}
          >
            View Details
          </a>
          <a
            className="usa-link usa-link--external"
            rel="noreferrer"
            target="_blank"
            href={`https://app01.cityofboston.gov/AssessingMap/?find=${parcelId}`}
          >
            Open in Map
          </a>
        </div>
      );
      delete newRow['']; // Remove the empty column for mobile view
    }
    return newRow;
  });

  return (
    <div className={styles.responsiveTable}>
      <div className={styles.fieldTable}>
        <FieldTable data={processedData} />
      </div>
      <div className={styles.recordTable}>
        {mobileData.map((row, idx) => (
          <RecordTable
            key={idx}
            data={row}
          />
        ))}
      </div>
    </div>
  );
};

export default ResponsiveTable; 