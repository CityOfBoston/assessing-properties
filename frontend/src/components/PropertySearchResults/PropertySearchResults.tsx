import React from 'react';
import styles from './PropertySearchResults.module.scss';
import { toWords } from 'number-to-words';
import FieldTable from '../FieldTable';

interface Property {
  parcelId: string;
  address: string;
  owner: string;
  value: string;
}

interface PropertySearchResultsProps {
  results: Property[];
}

export const PropertySearchResults: React.FC<PropertySearchResultsProps> = ({
  results,
}) => {
  const resultCount = results.length;
  // Keep the word in lowercase
  const resultWord = resultCount > 0 ? toWords(resultCount) : 'zero';
  
  // Transform data for FieldTable
  const tableData = results.map(property => ({
    'PARCEL ID': property.parcelId,
    'ADDRESS': property.address,
    'OWNER': property.owner,
    'VALUE': property.value,
    'DETAILS': (
      <a href={`/details?parcelId=${property.parcelId}`} className="usa-link">
        View Details
      </a>
    )
  }));
  
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>PARCEL RESULTS</h2>
      
      <div className="usa-hint">
        We found {resultWord} ({resultCount}) results.
      </div>
      
      <div className={styles.tableContainer}>
        <FieldTable data={tableData} />
      </div>
    </div>
  );
};

export default PropertySearchResults; 