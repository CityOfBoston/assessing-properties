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
import styles from './PropertyDetailsPage.module.scss';

/**
 * PropertyDetailPage displays comprehensive property information using the PropertyDetailsLayout
 * and various detail sections. It gets the parcelId from URL search parameters.
 */
export default function PropertyDetailsPage() {
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
      component: <OverviewSection data={{
        fullAddress: "123 Main Street, Boston, MA 02118",
        owners: ["John Smith", "Jane Smith"],
        imageSrc: "https://placehold.co/512x512",
        assessedValue: 750000,
        propertyType: "Residential - Single Family",
        parcelId: 1234567890,
        netTax: 7500,
        personalExample: false,
        residentialExemption: true
      }} />,
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