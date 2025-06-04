import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import SearchResultsLayout from '@layouts/SearchResultsLayout';
import WelcomeContent from '@components/WelcomeContent';
import { SearchBarContainer } from '@containers/SearchBarContainer';
import PropertySearchHelp from '@components/PropertySearchHelp';
import RecordTable from '@components/RecordTable';
import FieldTable from '@components/FieldTable';
import { ParcelId, DetailedSearchResult } from '@src/types';
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

const mockFetchResults = async (query: string): Promise<DetailedSearchResult[]> => {
  // Simulate a fetch delay
  await new Promise(res => setTimeout(res, 500));
  if (!query || query.toLowerCase() === 'notfound') return [];
  // Return dummy data
  return [
    {
      parcelId: ParcelId.create('1234567890'),
      fullAddress: '123 Main St, Boston, MA 02118',
      owners: ['John Doe'],
      value: 1234567,
    },
    {
      parcelId: ParcelId.create('9876543210'),
      fullAddress: '456 Elm St, Boston, MA 02118',
      owners: ['Jane Smith'],
      value: 7654321,
    },
  ];
};

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search') || '';
  const [results, setResults] = useState<DetailedSearchResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    setErrorMessage(undefined);
    mockFetchResults(query).then(data => {
      setResults(data);
      if (data.length === 0) {
        setErrorMessage('Unable to find a match. Please review the search tips below and try again.');
      }
    }).finally(() => setLoading(false));
  }, [query]);

  return (
    <SearchResultsLayout
      searchContent={
        <>
          <WelcomeContent hideTitleAndDescriptionOnMobile={true} />
          <div style={{ marginTop: 24 }}>
            <SearchBarContainer value={query} errorMessage={errorMessage} />
          </div>
        </>
      }
    >
      {loading ? (
        <div className={styles.loadingContainer}>Loading...</div>
      ) : results && results.length > 0 ? (
        <div className={styles.resultsContainer}>
          <h1 className={styles.resultsHeader}>Property Results</h1>
          <p className={styles.resultsDescription}>
            We found {toWords(results.length)} ({results.length}) result{results.length !== 1 ? 's' : ''}.
          </p>
          <div className={styles.fieldTable}>
            <FieldTable
              data={results.map(result => ({
                'Parcel ID': result.parcelId.toString(),
                'Address': result.fullAddress,
                'Owner(s)': result.owners.join(', '),
                'Assessed Value': `$${result.value.toLocaleString()}`,
                'Details': (
                  <Link to={`/details?parcelId=${result.parcelId.toString()}`} className={styles.detailsLink}>
                    View Details
                  </Link>
                ),
              }))}
            />
          </div>
          <div className={styles.recordTable}>
            {results.map((result, idx) => (
              <RecordTable
                key={result.parcelId.toString()}
                data={{
                  'Parcel ID': result.parcelId.toString(),
                  'Address': result.fullAddress,
                  'Owner(s)': result.owners.join(', '),
                  'Assessed Value': `$${result.value.toLocaleString()}`,
                  'Details': (
                    <Link to={`/details?parcelId=${result.parcelId.toString()}`} className={styles.detailsLink}>
                      View Details
                    </Link>
                  ),
                }}
              />
            ))}
          </div>
        </div>
      ) : (
        <PropertySearchHelp searchQuery={query} searchTips={searchTips} />
      )}
    </SearchResultsLayout>
  );
} 