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
  texts?: {
    heading?: string;
    resultsCount?: string;
    columnHeaders?: {
      parcelId?: string;
      address?: string;
      owner?: string;
      value?: string;
      details?: string;
    };
    viewDetails?: string;
  };
}

export const PropertySearchResults: React.FC<PropertySearchResultsProps> = ({
  results,
  texts
}) => {
  const resultCount = results.length;
  // Keep the word in lowercase
  const resultWord = resultCount > 0 ? toWords(resultCount) : 'zero';
  
  // Transform data for FieldTable
  const tableData = results.map(property => ({
    [texts.columnHeaders.parcelId]: property.parcelId,
    [texts.columnHeaders.address]: property.address,
    [texts.columnHeaders.owner]: property.owner,
    [texts.columnHeaders.value]: property.value,
    [texts.columnHeaders.details]: (
      <a href={`/details?parcelId=${property.parcelId}`} className="usa-link">
        {texts.viewDetails}
      </a>
    )
  }));
  
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>{texts.heading}</h2>
      
      <div className="usa-hint">
        {texts.resultsCount.replace('{count}', resultWord).replace('{number}', resultCount.toString())}
      </div>
      
      <div className={styles.tableContainer}>
        <FieldTable data={tableData} />
      </div>
    </div>
  );
};

export default PropertySearchResults; 