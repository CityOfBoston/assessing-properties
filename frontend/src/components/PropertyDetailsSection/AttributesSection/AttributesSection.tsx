import { useState } from 'react';
import PropertyDetailsSection from '../PropertyDetailsSection';
import styles from './AttributesSection.module.scss';
import { PropertyAttributesData } from '@src/types';

interface AttributesSectionProps {
  data: PropertyAttributesData;
  date?: Date;
}

export default function AttributesSection({ data, date }: AttributesSectionProps) {
  const [showAllAttributes, setShowAllAttributes] = useState(false);

  const attributeGroups = [
    {
      title: 'General',
      items: [
        { label: 'Land Use', value: data.landUse },
        { label: 'Living Area', value: data.livingArea ? `${data.livingArea} sq ft` : undefined },
        { label: 'Style', value: data.style },
        { label: 'Story Height', value: data.storyHeight },
        { label: 'Floor', value: data.floor },
        { label: 'Penthouse Unit', value: data.penthouseUnit },
        { label: 'Orientation', value: data.orientation },
      ],
    },
    {
      title: 'Rooms',
      items: [
        { label: 'Number of Bedrooms', value: data.bedroomNumber },
        { label: 'Total Bathrooms', value: data.totalBathrooms },
        { label: 'Half Bathrooms', value: data.halfBathrooms },
        { label: 'Bath Style 1', value: data.bathStyle1 },
        { label: 'Bath Style 2', value: data.bathStyle2 },
        { label: 'Bath Style 3', value: data.bathStyle3 },
        { label: 'Number of Kitchens', value: data.numberOfKitchens },
        { label: 'Kitchen Type', value: data.kitchenType },
        { label: 'Kitchen Style 1', value: data.kitchenStyle1 },
        { label: 'Kitchen Style 2', value: data.kitchenStyle2 },
        { label: 'Kitchen Style 3', value: data.kitchenStyle3 },
      ],
    },
    {
      title: 'Construction',
      items: [
        { label: 'Year Built', value: data.yearBuilt },
        { label: 'Exterior Finish', value: data.exteriorFinish },
        { label: 'Exterior Condition', value: data.exteriorCondition },
        { label: 'Roof Cover', value: data.roofCover },
        { label: 'Roof Structure', value: data.roofStructure },
        { label: 'Foundation', value: data.foundation },
        { label: 'Parking Spots', value: data.parkingSpots },
      ],
    },
    {
      title: 'Utilities',
      items: [
        { label: 'Heat Type', value: data.heatType },
        { label: 'AC Type', value: data.acType },
        { label: 'Fireplaces', value: data.fireplaces },
      ],
    },
    {
      title: 'Last Transaction',
      items: [
        { label: 'Sale Price', value: data.salePrice ? `$${data.salePrice}` : undefined },
        { label: 'Sale Date', value: data.saleDate },
        { label: 'Registry Book and Place', value: data.registryBookAndPlace },
      ],
    },
  ];

  return (
    <PropertyDetailsSection title="Attributes" date={date}>
      <div className={`${styles.grid} ${showAllAttributes ? styles.expanded : ''}`}>
        {attributeGroups
          .map(group => ({
            ...group,
            filteredItems: group.items.filter(item => item.value !== null && item.value !== undefined)
          }))
          .filter(group => group.filteredItems.length > 0)
          .map(group => (
          <div key={group.title} className={styles.group}>
            <h3>{group.title}</h3>
            <ul>
                {group.filteredItems.map(item => (
                <li key={item.label}>
                    <strong>{item.label}:</strong> {item.value}
                </li>
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