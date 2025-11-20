import React from 'react';
import { RecordTable } from '@components/RecordTable';
import styles from './FormDetailsReview.module.scss';
import type { PdfFormType } from '@src/types';

export interface PropertyData {
  parcelId: string;
  owner: string[];
  address: string;
  assessedValue: number;
}

export interface FormDetailsReviewProps {
  formType: PdfFormType;
  propertyData: PropertyData;
  isLoading?: boolean;
  onGenerate: () => void;
}

const formTypeLabels: Record<PdfFormType, string> = {
  residential: 'Residential Exemption',
  personal: 'Personal Exemption',
  abatement: 'Property Tax Abatement',
};

const formTypeDescriptions: Record<PdfFormType, string> = {
  residential: 'Apply for a residential exemption if you own and live in your property as a primary residence.',
  personal: 'Personal exemptions provide tax relief for eligible taxpayers based on statutory requirements.',
  abatement: 'Request a reduction in assessed value if your property is over-valued, improperly classified, or disproportionately assessed.',
};

/**
 * FormDetailsReview Component
 * 
 * Displays form type and property details before PDF generation.
 */
export default function FormDetailsReview({
  formType,
  propertyData,
  isLoading = false,
  onGenerate,
}: FormDetailsReviewProps) {
  const formLabel = formTypeLabels[formType];
  const formDescription = formTypeDescriptions[formType];

  const handleGenerate = () => {
    console.log('[FormDetailsReview] Generate button clicked', { formType, parcelId: propertyData.parcelId });
    onGenerate();
  };

  const propertyDataRecord = {
    'Parcel ID': propertyData.parcelId,
    'Owner': propertyData.owner.join(', '),
    'Address': propertyData.address,
    'Assessed Value': `$${propertyData.assessedValue.toLocaleString()}`,
  };

  return (
    <div className={styles.formDetailsContainer}>
      <div className={styles.header}>
        <div className={styles.formTypeBadge}>
          {formLabel}
        </div>
        <h2 className={styles.title}>REVIEW FORM DETAILS</h2>
        <p className={styles.description}>{formDescription}</p>
      </div>

      <div className={styles.propertyDetails}>
        <h3 className={styles.sectionTitle}>PROPERTY INFORMATION</h3>
        <RecordTable data={propertyDataRecord} />
      </div>

      <div className={styles.infoBox}>
        <p className={styles.infoText}>
          The form will be pre-filled with the information shown above. 
          You'll be able to review the completed form before printing or downloading.
        </p>
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={styles.generateButton}
          onClick={handleGenerate}
          disabled={isLoading}
          aria-label="Generate pre-filled form"
        >
          {isLoading ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Generating Form...
            </>
          ) : (
            'Generate Form'
          )}
        </button>
      </div>
    </div>
  );
}

