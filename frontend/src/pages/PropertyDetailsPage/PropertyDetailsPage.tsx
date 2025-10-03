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
import { getComponentText } from '@utils/contentMapper';
import { getAbatementPhase } from '@utils/periods';
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
  const pageContent = getComponentText('propertyDetails', 'pages.propertyDetails');
  const config = getComponentText('config');
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
        <h1>{pageContent.error.title}</h1>
        <p>{pageContent.error.description}</p>
      </div>
    );
  }

  // Get section names from content configuration
  if (!pageContent?.sections) {
    console.error('Missing section names in content configuration');
    return null;
  }
  const sectionNames = pageContent.sections;

  // Verify that all required section names are present
  const requiredSections = ['overview', 'value', 'attributes', 'taxes', 'permits', 'contact'];
  const missingSections = requiredSections.filter(section => !sectionNames[section]?.name);
  if (missingSections.length > 0) {
    console.error('Missing required section names:', missingSections);
    return null;
  }
  
  // Handle loading state
  if (isLoading || error || !propertyDetails) {
    const loadingName = sectionNames?.loading?.name || "Loading";
    return (
      <div className={styles.propertyDetailsPage}>
        {config.test?.enabled && <TimeChanger />}
        <PropertyDetailsLayout 
          sections={[{
            name: loadingName,
            component: (
              <div className={styles.fullWidthLoadingContainer}>
                <LoadingIndicator 
                  message={error ? `Error: ${error.message}` : (pageContent?.loading?.message || "Loading property details...")} 
                  size="large" 
                />
              </div>
            ),
          }]}
          parcelId={parcelId}
        />
      </div>
    );
  }

  // Check if abatements section should be shown
  const now = date;
  const calendarYear = now.getFullYear();
  const nowMonth = now.getMonth();
  const abatementYear = nowMonth >= 6 ? calendarYear : calendarYear - 1;
  const abatementPhase = getAbatementPhase(now, abatementYear);

  // Build sections array
  const sections = [
    {
      name: sectionNames.overview.name,
      component: <OverviewSection data={propertyDetails.overview} title={sectionNames.overview.name} />,
    },
    {
      name: sectionNames.value.name,
      component: <PropertyValueSection {...propertyDetails.propertyValue} title={sectionNames.value.name} />,
    },
    {
      name: sectionNames.attributes.name,
      component: <AttributesSection data={propertyDetails.propertyAttributes} title={sectionNames.attributes.name} />,
    },
    {
      name: sectionNames.taxes.name,
      component: <PropertyTaxesSection {...propertyDetails.propertyTaxes} title={sectionNames.taxes.name} />,
    },
    ...(abatementPhase.message ? [{
      name: sectionNames.abatements.name,
      component: <AbatementsSection parcelId={parcelId} title={sectionNames.abatements.name} />,
    }] : []),
    {
      name: sectionNames.permits.name,
      component: <ApprovedPermitsSection parcelId={parcelId} title={sectionNames.permits.name} />,
    },
    {
      name: sectionNames.contact.name,
      component: <ContactUsSection title={sectionNames.contact.name} />,
    },
  ];

  return (
    <div className={styles.propertyDetailsPage}>
      {config.test?.enabled && <TimeChanger />}
      <PropertyDetailsLayout 
        sections={sections}
        parcelId={parcelId}
      />
    </div>
  );
} 