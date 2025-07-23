import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams} from 'react-router-dom';
import SearchResultsLayout from '@layouts/SearchResultsLayout';
import WelcomeContent from '@components/WelcomeContent';
import { SearchBarContainer } from '@containers/SearchBarContainer';
import PropertySearchHelp from '@components/PropertySearchHelp';
import ResponsiveTable from '@components/ResponsiveTable';
import { LoadingIndicator } from '@src/components/LoadingIndicator';
import { PropertySearchResult } from '@src/types';
import { useSearchResults } from '../../hooks/useSearchResults';
import styles from './SearchResultsPage.module.scss';
import { toWords } from 'number-to-words';

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

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const navigate = useNavigate();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const { searchResults, isLoading, error, performSearch } = useSearchResults();

  const handlePropertySelect = (pid: string, fullAddress?: string) => {
    console.log('[SearchResultsPage] handlePropertySelect called with pid:', pid, 'address:', fullAddress);
    // Navigate to property details page
    navigate(`/details?parcelId=${pid}`);
  };

  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, performSearch]);

  // Get results array or empty array if no results
  const results = searchResults?.results || [];
  
  // Determine error message based on different scenarios
  const getErrorMessage = () => {
    if (error) {
      return 'An error occurred while fetching search results.';
    }
    
    if (!isLoading && query && results.length === 0) {
      return 'Unable to find a match. Please review the search tips below and try again.';
    }
    
    return undefined;
  };

  const errorMessage = getErrorMessage();

  const tableData = results.map((result: PropertySearchResult) => ({
    'Parcel ID': result.parcelId.toString(),
    'Address': result.address,
    'Owner(s)': result.owners.join(', '),
    'Assessed Value': `$${result.value.toLocaleString()}`,
    'Details': null, // This will be handled by ResponsiveTable
  }));

  return (
    <SearchResultsLayout
      searchContent={
        <WelcomeContent
          additionalContent={
            <SearchBarContainer
              onSelect={handlePropertySelect}
              labelText="Search by address or parcel ID"
              tooltipHint="A unique, legal 10 digit number assigned by the City of Boston to each parcel of property."
              placeholderText="Enter address or parcel ID"
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          }
          hideTitleAndDescriptionOnMobile={isSearchFocused}
        />
      }
    >
      <div className={styles.resultsArea}>
        {isLoading ? (
          <div className={styles.loadingContainer}>
            <LoadingIndicator 
              message="Loading search results..." 
              size="medium" 
            />
          </div>
        ) : results && results.length > 0 ? (
          <div className={styles.resultsContainer}>
            <h1 className={styles.resultsHeader}>Property Results</h1>
            <p className={styles.resultsDescription}>
              We found {toWords(results.length)} ({results.length}) result{results.length !== 1 ? 's' : ''}.
            </p>
            <div className={styles.resultsTable}>
              <ResponsiveTable
                data={tableData}
                showDetails={true}
                showMapLink={true}
              />
            </div>
          </div>
        ) : (
          <PropertySearchHelp searchQuery={query} searchTips={searchTips} />
        )}
      </div>
    </SearchResultsLayout>
  );
} 