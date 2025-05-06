import React from 'react';
import RecordTable, { RecordTableData } from '../../RecordTable/RecordTable';
import { PropertyData } from '../PropertyDetailsContent';
import styles from '../PropertyDetailsContent.module.scss';

interface GeneralInformationTemplateProps {
  propertyData: PropertyData;
}

/**
 * Template for the General Information section of property details
 */
export const GeneralInformationTemplate: React.FC<GeneralInformationTemplateProps> = ({
  propertyData
}) => {
  // Format property data for RecordTable component
  const recordTableData: RecordTableData = {
    'Parcel ID': propertyData.parcelId,
    'Property Type': propertyData.propertyType,
    'Classification Code': propertyData.classificationCode,
    'Lot Size': propertyData.lotSize,
    'Living Area': propertyData.livingArea,
    [`Owner on ${propertyData.ownerAsOf.date}`]: propertyData.ownerAsOf.name,
    'Owner\'s Mailing Address': propertyData.ownerMailingAddress,
    'Residential Exemptions': propertyData.residentialExemptions,
    'Personal Exemptions': propertyData.personalExemptions,
  };

  return (
    <div className={styles.contentSection}>
      <h1 className={styles.sectionHeader}>GENERAL INFORMATION</h1>
      
      <div className={styles.recordTableWrapper}>
        <RecordTable data={recordTableData} />
      </div>
      
      <h1 className={styles.sectionHeader}>APPROVED BUILDING PERMITS</h1>
      
      <p className={styles.sectionText}>
        This dataset includes information about building permits issued by the City of Boston from 2009 to the present. 
        Permits that are being processed or have been denied, deleted, void or revoked are not included in the dataset.
      </p>
      
      <a 
        className="usa-link usa-link--external" 
        rel="noreferrer" 
        target="_blank"  
        href={propertyData.buildingPermitsLink || '#'}
      >
        View approved building permits
      </a>
    </div>
  );
};

export default GeneralInformationTemplate; 