import React from 'react';
import { GeneralInformationTemplate } from './templates';
import styles from './PropertyDetailsContent.module.scss';

// Property data interface
export interface PropertyData {
  parcelId: string;
  propertyType: string;
  classificationCode: string;
  lotSize: string;
  livingArea: string;
  ownerAsOf: {
    name: string;
    date: string; // Format: "Monday, January 1st 2024"
  };
  ownerMailingAddress: string;
  residentialExemptions: string;
  personalExemptions: string;
  buildingPermitsLink?: string;
  // Add more fields as needed for other content sections
}

export interface PropertyDetailsContentProps {
  /**
   * ID to determine which content to display
   */
  contentId: string;
  
  /**
   * Property data to display
   */
  propertyData: PropertyData;
}

/**
 * PropertyDetailsContent component renders different content templates
 * based on the provided contentId.
 * 
 * This component serves as a router to different content templates
 * based on the contentId prop.
 */
export const PropertyDetailsContent: React.FC<PropertyDetailsContentProps> = ({
  contentId,
  propertyData
}) => {
  // Switch between different content templates based on contentId
  const renderContent = () => {
    switch (contentId) {
      case 'general_information':
        return <GeneralInformationTemplate propertyData={propertyData} />;
      // Add more cases for other content types
      // case 'assessment':
      //   return <AssessmentTemplate propertyData={propertyData} />;
      // case 'ownership_history':
      //   return <OwnershipHistoryTemplate propertyData={propertyData} />;
      default:
        return (
          <div className={styles.contentSection}>
            <p className={styles.noContentMessage}>No content available for this section.</p>
          </div>
        );
    }
  };

  return renderContent();
};

export default PropertyDetailsContent; 