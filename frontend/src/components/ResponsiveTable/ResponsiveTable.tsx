import React, { useState } from 'react';
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
  texts?: {
    viewDetails?: string;
    openInMap?: string;
    columnHeaders?: { [key: string]: string };
  };
}

/**
 * ResponsiveTable displays data in either a FieldTable (desktop) or RecordTable (mobile) format
 * based on screen size. It automatically handles the responsive switching between views.
 */
export const ResponsiveTable: React.FC<ResponsiveTableProps> = ({
  data,
  showDetails = false,
  showMapLink = false,
  texts = {
    viewDetails: "View Details",
    openInMap: "Open in Map",
    columnHeaders: {}
  }
}) => {
  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
  const [openedRowIndex, setOpenedRowIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return null;
  }

  const processedData = data.map(row => {
    const newRow = { ...row };
    if (showDetails) {
      // Get parcelId from either the 'Parcel ID' or 'parcelId' field
      const parcelId = (row['Parcel ID'] || row.parcelId) as string;
      const detailsLink = (
        <a
          className="usa-link"
          rel="noreferrer"
          href={`#/details?parcelId=${parcelId}`}
        >
          {texts.viewDetails}
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
            {texts.openInMap}
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
      // Get parcelId from either the 'Parcel ID' or 'parcelId' field
      const parcelId = (row['Parcel ID'] || row.parcelId) as string;
      newRow['Details'] = (
        <div className={styles.detailsLinks}>
          <a
            className="usa-link"
            rel="noreferrer"
            href={`#/details?parcelId=${parcelId}`}
          >
            {texts.viewDetails}
          </a>
          <a
            className="usa-link usa-link--external"
            rel="noreferrer"
            target="_blank"
            href={`https://app01.cityofboston.gov/AssessingMap/?find=${parcelId}`}
          >
            {texts.openInMap}
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
        <FieldTable
          data={processedData}
          activeRowIndex={activeRowIndex}
          setActiveRowIndex={setActiveRowIndex}
          openedRowIndex={openedRowIndex}
          setOpenedRowIndex={setOpenedRowIndex}
        />
      </div>
      <div className={styles.recordTable}>
        {mobileData.map((row, idx) => (
          <RecordTable
            key={idx}
            data={row}
            rowIndex={idx}
            activeRowIndex={activeRowIndex}
            setActiveRowIndex={setActiveRowIndex}
            openedRowIndex={openedRowIndex}
            setOpenedRowIndex={setOpenedRowIndex}
          />
        ))}
      </div>
    </div>
  );
};

export default ResponsiveTable; 