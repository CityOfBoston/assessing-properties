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
} from '@components/PropertyDetailSections';
import styles from './PropertyDetailPage.module.scss';

/**
 * PropertyDetailPage displays comprehensive property information using the PropertyDetailsLayout
 * and various detail sections. It gets the parcelId from URL search parameters.
 */
export default function PropertyDetailPage() {
  const [searchParams] = useSearchParams();
  const parcelId = searchParams.get('parcelId') || '';

  // If no parcelId is provided, we could redirect to search or show an error
  if (!parcelId) {
    return (
      <div className={styles.error}>
        <h1>Property Not Found</h1>
        <p>No property ID was provided. Please try searching for a property.</p>
      </div>
    );
  }

  const sections = [
    {
      name: 'Overview',
      component: <OverviewSection />,
    },
    {
      name: 'Property Value',
      component: <PropertyValueSection />,
    },
    {
      name: 'Attributes',
      component: <AttributesSection />,
    },
    {
      name: 'Property Taxes',
      component: <PropertyTaxesSection />,
    },
    {
      name: 'Abatements',
      component: <AbatementsSection />,
    },
    {
      name: 'Permits',
      component: <ApprovedPermitsSection />,
    },
    {
      name: 'Contact Us',
      component: <ContactUsSection />,
    },
  ];

  return (
    <div className={styles.propertyDetailPage}>
      <PropertyDetailsLayout 
        sections={sections}
        parcelId={parcelId}
      />
    </div>
  );
} 