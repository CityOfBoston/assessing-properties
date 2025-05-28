import React, { useState, useCallback } from 'react';
import WelcomePageLayout from '@layouts/WelcomePageLayout';
import { WelcomeContent } from '@components/WelcomeContent';
import { PropertySearchHelp } from '@components/PropertySearchHelp';
import { FieldTable } from '@components/FieldTable';
import { DetailedSearchResult } from '@src/types';
import { SearchBarContainer } from '@containers/SearchBarContainer';
import styles from './PropertySearchPage.module.scss';

interface PropertySearchPageProps {
  results: DetailedSearchResult[];
  searchQuery: string;
}

export const PropertySearchPage: React.FC<PropertySearchPageProps> = ({ 
  results,
  searchQuery 
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  const handleFocus = useCallback(() => {
    setIsSearchFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    if (!isClearing) {
      setIsSearchFocused(false);
    }
  }, [isClearing]);

  const handleClear = useCallback(() => {
    setIsClearing(true);
    // Reset the clearing flag after a short delay
    setTimeout(() => {
      setIsClearing(false);
    }, 100);
  }, []);

  // Transform data for FieldTable
  const tableData = results.map(result => ({
    'Parcel ID': result.parcelId.toString(),
    'Address': result.fullAddress,
    'Owner': result.owners.join(', '),
    'Value': `$${result.value.toLocaleString()}`,
    'Details': (
      <a href={`/details?parcelId=${result.parcelId}`} className={styles.detailsLink}>
        View Details
      </a>
    )
  }));

  const searchTips = [
    {
      title: 'Check the street name spelling.',
      description: 'Make sure the street name is spelled correctly.'
    },
    {
      title: 'Verify the street number.',
      description: 'Ensure the street number is accurate. Do not include apartment numbers or extensions like letters or dashes (e.g., 123A or 123-1)'
    },
    {
      title: 'Use directionals correctly.',
      description: 'For directional street names, use abbreviations. For example, instead of "West Second Street," enter "W Second".'
    },
    {
      title: 'Use common abbreviations.',
      description: 'Street names may include abbreviations. For instance, "Saint Rose" might appear as "St Rose". Also, note that punctuation is not used in street names.'
    }
  ];

  return (
    <WelcomePageLayout
      welcomeContent={
        <WelcomeContent 
          additionalContent={
            <SearchBarContainer 
              onFocus={handleFocus}
              onBlur={handleBlur}
              onClear={handleClear}
            />
          }
          hideTitleAndDescriptionOnMobile={isSearchFocused}
        />
      }
      searchResults={
        results.length === 0 ? (
          <PropertySearchHelp 
            searchQuery={searchQuery}
            searchTips={searchTips}
          />
        ) : (
          <div className={styles.container}>
            <h2 className={styles.heading}>PARCEL RESULTS</h2>
            <div className="usa-hint">
              We found {results.length} result{results.length !== 1 ? 's' : ''}.
            </div>
            <div className={styles.tableContainer}>
              <FieldTable data={tableData} />
            </div>
          </div>
        )
      }
    />
  );
}; 