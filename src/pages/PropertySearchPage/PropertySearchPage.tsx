import React from 'react';
import styles from './PropertySearchPage.module.scss';

// Layout
import PageLayout from '../../layouts/PageLayout';

// Components
import SearchHeader from '../../components/SearchHeader';
import AnnotatedSearchBar from '../../components/AnnotatedSearchBar';
import PropertySearchHelp from '../../components/PropertySearchHelp';
import PropertySearchResults from '../../components/PropertySearchResults';

// Types 
export enum ResultsState {
  NONE,
  HELP,
  RESULTS
}

// Example search tips
export const searchTips = [
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

// Example search results
export const mockProperties = [
  {
    parcelId: '0102345000',
    address: '25 Beacon St',
    owner: 'Commonwealth of Massachusetts',
    value: '$125,000,000',
  },
  {
    parcelId: '0304567000',
    address: '1 City Hall Plaza',
    owner: 'City of Boston',
    value: '$96,750,000',
  },
  {
    parcelId: '0203456100',
    address: '100 Huntington Ave',
    owner: 'Prudential Tower LLC',
    value: '$210,450,000',
  },
];

interface PropertySearchPageProps {
  resultsState?: ResultsState;
  errorMessage?: string;
  searchQuery?: string;
}

export const PropertySearchPage: React.FC<PropertySearchPageProps> = ({
  resultsState = ResultsState.NONE,
  errorMessage,
  searchQuery = "123 Main St"
}) => {
  // For real implementation, this would handle actual search functionality
  const handleSearch = (searchTerm: string) => {
    console.log('Searching for:', searchTerm);
    // This would typically make an API call and update the state based on results
  };
  
  return (
    <PageLayout>
      <div className={styles.page}>
        {/* Search Container */}
        <div className={styles.searchContainer}>
          <SearchHeader 
            heading="ASSESSING ONLINE"
            description={
              <>
                <p>
                  Assessing Online offers direct access to comprehensive property parcel data for every property in the city, including assessed value, location, ownership, and tax information. The application serves a broad range of users:
                </p>
                <ul>
                  <li>
                    <span className={styles.bulletLabel}>Taxpayers and Homeowners:</span> Access current property values and tax status to manage ownership responsibilities.
                  </li>
                  <li>
                    <span className={styles.bulletLabel}>Real Estate, Business, and Legal Professionals:</span> Use reliable data to support operations, planning, and compliance.
                  </li>
                  <li>
                    <span className={styles.bulletLabel}>Researchers and Analysts:</span> Explore GIS data for insights into demographics, land use, and development trends.
                  </li>
                </ul>
              </>
            }
          />
          
          <AnnotatedSearchBar
            labelText="Search by address or parcel ID"
            tooltipHint="A parcel ID, also known as a property identification number (PIN) or assessor's parcel number (APN), is a unique identifier assigned to a specific piece of land by local government authorities."
            searchHint="Example: 1 City Hall Sq | 0504203000 | 352R Blue Hill Ave Apt # 3"
            placeholderText="Enter address or parcel ID"
            errorMessage={errorMessage}
            onSearch={handleSearch}
          />
        </div>

        {/* Divider - only shown when there are results */}
        {resultsState !== ResultsState.NONE && (
          <div className={styles.divider}></div>
        )}

        {/* Results Container */}
        {resultsState !== ResultsState.NONE && (
          <div className={styles.resultsContainer}>
            {resultsState === ResultsState.HELP ? (
              <PropertySearchHelp
                searchQuery={searchQuery}
                searchTips={searchTips}
              />
            ) : (
              <PropertySearchResults
                results={mockProperties}
              />
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default PropertySearchPage; 