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
import { usePropertyDetails } from '@hooks/usePropertyDetails';
import styles from './PropertyDetailsPage.module.scss';

/**
 * PropertyDetailPage displays comprehensive property information using the PropertyDetailsLayout
 * and various detail sections. It gets the parcelId from URL search parameters and fetches
 * property details using the usePropertyDetails hook.
 */
export default function PropertyDetailsPage() {
  const [searchParams] = useSearchParams();
  const parcelId = searchParams.get('parcelId') || '';
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
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading property details...</p>
          {error && <p className={styles.errorText}>Error: {error.message}</p>}
        </div>
      ),
    },
  ] : [
    {
      name: 'Overview',
      component: <OverviewSection data={propertyDetails.overview} />,
    },
    {
      name: 'Property Value',
      component: <PropertyValueSection {...propertyDetails.propertyValue} />,
    },
    {
      name: 'Attributes',
      component: <AttributesSection data={propertyDetails.propertyAttributes} />,
    },
    {
      name: 'Property Taxes',
      component: <PropertyTaxesSection {...propertyDetails.propertyTaxes} />,
    },
    {
      name: 'Abatements',
      component: <AbatementsSection />,
    },
    {
      name: 'Approved Permits',
      component: <ApprovedPermitsSection parcelId={parcelId} />,
    },
    {
      name: 'Contact Us',
      component: <ContactUsSection />,
    },
  ];

  return (
    <div className={styles.propertyDetailsPage}>
      <PropertyDetailsLayout 
        sections={sections}
        parcelId={parcelId}
      />
    </div>
  );
} 