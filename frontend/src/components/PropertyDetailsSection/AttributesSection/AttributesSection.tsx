import { useState } from 'react';
import PropertyDetailsSection from '../PropertyDetailsSection';
import styles from './AttributesSection.module.scss';

interface PropertyAttributesData {
  // Bedrooms
  bedroomNumber?: number;
  bedroomType?: string;
  totalRooms?: number;

  // Bathrooms
  totalBathrooms?: number;
  halfBathrooms?: number;
  bathStyle1?: string;
  bathStyle2?: string;
  bathStyle3?: string;

  // Kitchen
  numberOfKitchens?: number;
  kitchenType?: string;
  kitchenStyle1?: string;
  kitchenStyle2?: string;
  kitchenStyle3?: string;

  // Utilities
  fireplaces?: number;
  acType?: string;
  heatType?: string;

  // Interior
  interiorCondition?: string;
  interiorFinish?: string;

  // Exterior
  exteriorFinish?: string;
  exteriorCondition?: string;
  view?: string;
  grade?: string;

  // Construction
  yearBuilt?: number;
  roofCover?: string;
  roofStructure?: string;
  foundation?: string;
  landUse?: string;

  // Last Transaction
  salePrice?: number;
  saleDate?: string;
  registryBookAndPlace?: string;

  // Parking
  parkingSpots?: number;
  parkingOwnership?: string;
  parkingType?: string;
  tandemParking?: boolean;

  // Details
  propertyType?: string;
  livingArea?: number;
  floor?: number;
  penthouseUnit?: boolean;
  complex?: string;
  storyHeight?: number;
  style?: string;
  orientation?: string;
}

interface AttributesSectionData {
  data: PropertyAttributesData;
}

export default function AttributesSection({ data }: AttributesSectionData) {
  const [showAllAttributes, setShowAllAttributes] = useState(false);

  const attributeGroups = [
    {
      title: 'Bedrooms',
      items: [
        { label: 'Number of Bedrooms', value: data.bedroomNumber },
        { label: 'Bedroom Type', value: data.bedroomType },
        { label: 'Total Rooms', value: data.totalRooms },
      ],
    },
    {
      title: 'Bathrooms',
      items: [
        { label: 'Total Bathrooms', value: data.totalBathrooms },
        { label: 'Half Bathrooms', value: data.halfBathrooms },
        { label: 'Bath Style 1', value: data.bathStyle1 },
        { label: 'Bath Style 2', value: data.bathStyle2 },
        { label: 'Bath Style 3', value: data.bathStyle3 },
      ],
    },
    {
      title: 'Kitchen',
      items: [
        { label: 'Number of Kitchens', value: data.numberOfKitchens },
        { label: 'Kitchen Type', value: data.kitchenType },
        { label: 'Kitchen Style 1', value: data.kitchenStyle1 },
        { label: 'Kitchen Style 2', value: data.kitchenStyle2 },
        { label: 'Kitchen Style 3', value: data.kitchenStyle3 },
      ],
    },
    {
      title: 'Utilities',
      items: [
        { label: 'Fireplaces', value: data.fireplaces },
        { label: 'AC Type', value: data.acType },
        { label: 'Heat Type', value: data.heatType },
      ],
    },
    {
      title: 'Interior',
      items: [
        { label: 'Interior Condition', value: data.interiorCondition },
        { label: 'Interior Finish', value: data.interiorFinish },
      ],
    },
    {
      title: 'Exterior',
      items: [
        { label: 'Exterior Finish', value: data.exteriorFinish },
        { label: 'Exterior Condition', value: data.exteriorCondition },
        { label: 'View', value: data.view },
        { label: 'Grade', value: data.grade },
      ],
    },
    {
      title: 'Construction',
      items: [
        { label: 'Year Built', value: data.yearBuilt },
        { label: 'Roof Cover', value: data.roofCover },
        { label: 'Roof Structure', value: data.roofStructure },
        { label: 'Foundation', value: data.foundation },
        { label: 'Land Use', value: data.landUse },
      ],
    },
    {
      title: 'Last Transaction',
      items: [
        { label: 'Sale Price', value: data.salePrice ? `$${data.salePrice.toLocaleString()}` : undefined },
        { label: 'Sale Date', value: data.saleDate },
        { label: 'Registry Book and Place', value: data.registryBookAndPlace },
      ],
    },
    {
      title: 'Parking',
      items: [
        { label: 'Parking Spots', value: data.parkingSpots },
        { label: 'Parking Ownership', value: data.parkingOwnership },
        { label: 'Parking Type', value: data.parkingType },
        { label: 'Tandem Parking', value: data.tandemParking ? 'Yes' : 'No' },
      ],
    },
    {
      title: 'Details',
      items: [
        { label: 'Property Type', value: data.propertyType },
        { label: 'Living Area', value: data.livingArea ? `${data.livingArea} sq ft` : undefined },
        { label: 'Floor', value: data.floor },
        { label: 'Penthouse Unit', value: data.penthouseUnit ? 'Yes' : 'No' },
        { label: 'Complex', value: data.complex },
        { label: 'Story Height', value: data.storyHeight },
        { label: 'Style', value: data.style },
        { label: 'Orientation', value: data.orientation },
      ],
    },
  ];

  return (
    <PropertyDetailsSection title="Attributes">
      <div className={`${styles.grid} ${showAllAttributes ? styles.expanded : ''}`}>
        {attributeGroups.map((group) => (
          <div key={group.title} className={styles.group}>
            <h3>{group.title}</h3>
            <ul>
              {group.items.map((item) => (
                item.value !== undefined && (
                  <li key={item.label}>
                    <strong>{item.label}:</strong> {item.value}
                  </li>
                )
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button
        className={styles.seeMoreButton}
        onClick={() => setShowAllAttributes(!showAllAttributes)}
      >
        {showAllAttributes ? 'See Less' : 'See More'}
        <span className={`${styles.arrow} ${showAllAttributes ? styles.up : ''}`} />
      </button>
    </PropertyDetailsSection>
  );
} 