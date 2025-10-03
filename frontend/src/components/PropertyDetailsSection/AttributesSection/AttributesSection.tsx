import { useState } from 'react';
import PropertyDetailsSection from '../PropertyDetailsSection';
import { getComponentText } from '@utils/contentMapper';
import styles from './AttributesSection.module.scss';
import { PropertyAttributesData } from '@src/types';

interface AttributesSectionProps {
  data: PropertyAttributesData;
  title: string;
}

// Helper function to check if an item is a category
const isCategory = (item: PropertyAttributeCategory | PropertyAttributeField): item is PropertyAttributeCategory => {
  return 'title' in item && 'content' in item;
};

// Helper function to render attribute fields
const renderAttributeFields = (fields: PropertyAttributeField[]) => {
  const filteredFields = fields.filter(field => field.value !== null && field.value !== undefined);
  if (filteredFields.length === 0) return null;

  return (
    <ul>
      {filteredFields.map(field => (
        <li key={field.label}>
          <strong>{field.label}:</strong> {field.value}
        </li>
      ))}
    </ul>
  );
};

export default function AttributesSection({ data, title }: AttributesSectionProps) {
  const [showAllAttributes, setShowAllAttributes] = useState(false);
  const attributeGroups = data?.attributeGroups || [];

  console.log("[AttributesSection] Rendering with data:", {
    data,
    attributeGroups,
    firstGroupContent: attributeGroups[0]?.content
  });

  return (
    <PropertyDetailsSection title={title}>
      <div className={`${styles.grid} ${showAllAttributes ? styles.expanded : ''}`}>
        {attributeGroups
          .filter(group => {
            // Filter out empty groups
            if (Array.isArray(group.content)) {
              return group.content.some(item => {
                if (isCategory(item)) {
                  return item.content.some(field => field.value !== null && field.value !== undefined);
                }
                return item.value !== null && item.value !== undefined;
              });
            }
            return false;
          })
          .map(group => (
            <div key={group.title} className={styles.group}>
              <h3>{group.title}</h3>
              <div className={
                // If any item is a category, use subgroupGrid, otherwise use directContent
                Array.isArray(group.content) && group.content.some(isCategory) ? styles.subgroupGrid : styles.directContent
              }>
                {Array.isArray(group.content) && group.content.map((item, index) => {
                  if (isCategory(item)) {
                    // If it's a category, render it with its own header
                    return (
                      <div key={item.title || index} className={styles.subgroup}>
                        <h4>{item.title}</h4>
                        {renderAttributeFields(item.content)}
                      </div>
                    );
                  } else {
                    // If it's a direct attribute field, render it
                    return renderAttributeFields([item]);
                  }
                })}
              </div>
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