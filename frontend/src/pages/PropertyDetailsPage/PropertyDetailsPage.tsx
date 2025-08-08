import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import PropertyDetailsLayout from '@layouts/PropertyDetailsLayout';
import {
  OverviewSection,
  PropertyValueSection,
  AttributesSection,
  PropertyTaxesSection,
  AbatementsSection,
  ApprovedPermitsSection,
  ContactUsSection,
} from '@src/components/PropertyDetailsSection';
import { LoadingIndicator } from '@src/components/LoadingIndicator';
import { usePropertyDetails } from '../../hooks/usePropertyDetails';
import { useDateContext } from '@src/hooks/useDateContext';
import TimeChanger from '@src/components/TimeChanger/TimeChanger';
import styles from './PropertyDetailsPage.module.scss';

/**
 * Helper function to get fiscal year from a date
 * Fiscal year starts July 1st of previous year, ends June 30th of current year
 * e.g., July 1, 2024 - June 30, 2025 is FY2025
 */
function getFiscalYear(date: Date): number {
  const year = date.getFullYear();
  const month = date.getMonth(); // 0-indexed: 0=Jan, 6=July
  return month >= 6 ? year + 1 : year;
}

/**
 * PropertyDetailPage displays comprehensive property information using the PropertyDetailsLayout
 * and various detail sections. It gets the parcelId from URL search parameters and fetches
 * property details using the usePropertyDetails hook.
 */
export default function PropertyDetailsPage() {
  const [searchParams] = useSearchParams();
  const parcelId = searchParams.get('parcelId') || '';
  const { date } = useDateContext();
  const lastFiscalYearRef = useRef<number | null>(null);
  const lastParcelIdRef = useRef<string | null>(null);

  const { propertyDetails, isLoading, error, fetchPropertyDetails } = usePropertyDetails();

  useEffect(() => {
    if (parcelId) {
      const currentFiscalYear = getFiscalYear(date);
      
      // Fetch property details when parcelId changes or on first load
      // For fiscal year changes, let useDateContext handle the page reload
      const isFirstLoad = lastFiscalYearRef.current === null;
      const isParcelIdChanged = lastParcelIdRef.current !== parcelId;
      const isSameFiscalYear = lastFiscalYearRef.current === currentFiscalYear;
      
      if (isFirstLoad || (isParcelIdChanged && isSameFiscalYear)) {
        lastFiscalYearRef.current = currentFiscalYear;
        lastParcelIdRef.current = parcelId;
        fetchPropertyDetails(parcelId, date.toISOString().slice(0, 10));
      }
    }
  }, [parcelId, date, fetchPropertyDetails]);

  // If no parcelId is provided, show error
  if (!parcelId) {
    return (
      <div className={styles.error}>
        <h1>Property Not Found</h1>
        <p>No property ID was provided. Please try searching for a property.</p>
      </div>
    );
  }

  // Create sections array with all available sections
  const sections = isLoading || error || !propertyDetails ? [
    {
      name: 'Loading',
      component: (
        <div className={styles.fullWidthLoadingContainer}>
          <LoadingIndicator 
            message={error ? `Error: ${error.message}` : "Loading property details..."} 
            size="large" 
          />
        </div>
      ),
    },
  ] : [
    {
      name: 'Overview',
      component: <OverviewSection data={propertyDetails.overview} />,
    },
    {
      name: 'Value',
      component: <PropertyValueSection {...propertyDetails.propertyValue} />,
    },
    {
      name: 'Attributes',
      component: <AttributesSection data={propertyDetails.propertyAttributes} />,
    },
    {
      name: 'Taxes & Exemptions',
      component: <PropertyTaxesSection {...propertyDetails.propertyTaxes} />,
    },
    {
      name: 'Abatements',
      component: <AbatementsSection />,
    },
    {
      name: 'Permits',
      component: <ApprovedPermitsSection parcelId={parcelId} />,
    },
    {
      name: 'Contact Us',
      component: <ContactUsSection />,
    },
  ];

  return (
    <div className={styles.propertyDetailsPage}>
      <TimeChanger />
      <PropertyDetailsLayout 
        sections={sections}
        parcelId={parcelId}
      />
    </div>
  );
} 