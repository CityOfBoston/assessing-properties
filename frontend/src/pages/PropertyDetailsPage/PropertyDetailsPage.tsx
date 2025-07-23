import { useEffect } from 'react';
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
import TimeChanger from '@src/components/TimeChanger/TimeChanger';
import styles from './PropertyDetailsPage.module.scss';

/**
 * PropertyDetailPage displays comprehensive property information using the PropertyDetailsLayout
 * and various detail sections. It gets the parcelId from URL search parameters and fetches
 * property details using the usePropertyDetails hook.
 */
export default function PropertyDetailsPage() {
  const [searchParams] = useSearchParams();
  const parcelId = searchParams.get('parcelId') || '';
  const dateParam = searchParams.get('date');
  // Parse 'YYYY-MM-DD' format, fallback to today
  let date: Date;
  if (dateParam && /^\d{4}-\d{2}-\d{2}$/.test(dateParam)) {
    const [year, month, day] = dateParam.split('-').map(Number);
    if (
      year &&
      month &&
      day &&
      !isNaN(year) &&
      !isNaN(month) &&
      !isNaN(day)
    ) {
      date = new Date(year, month - 1, day);
    } else {
      date = new Date();
    }
  } else {
    date = new Date();
  }
  // Only use the date part (no time)
  date = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const { propertyDetails, isLoading, error, fetchPropertyDetails } = usePropertyDetails();

  useEffect(() => {
    if (parcelId) {
      fetchPropertyDetails(parcelId);
    }
  }, [parcelId, fetchPropertyDetails]);

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
      component: <OverviewSection data={propertyDetails.overview} date={date} />, // pass date
    },
    {
      name: 'Value',
      component: <PropertyValueSection {...propertyDetails.propertyValue} date={date} />, // pass date
    },
    {
      name: 'Attributes',
      component: <AttributesSection data={propertyDetails.propertyAttributes} date={date} />, // pass date
    },
    {
      name: 'Taxes & Exemptions',
      component: <PropertyTaxesSection {...propertyDetails.propertyTaxes} date={date} />, // pass date
    },
    {
      name: 'Abatements',
      component: <AbatementsSection date={date} />, // pass date
    },
    {
      name: 'Permits',
      component: <ApprovedPermitsSection parcelId={parcelId} date={date} />, // pass date
    },
    {
      name: 'Contact Us',
      component: <ContactUsSection date={date} />, // pass date
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