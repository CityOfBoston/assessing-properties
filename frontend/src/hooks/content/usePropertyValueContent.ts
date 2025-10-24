/**
 * Property Value Content Hook - OWNS property value section content coordination
 * 
 * Responsibilities:
 * - Coordinates property value display data
 * - Manages show/hide state for value history
 * - Formats historical values for table and chart display
 * - Handles scrolling behavior for value history section
 * 
 * Does NOT:
 * - Perform business calculations
 * - Create complex React elements (simple state management only)
 * - Fetch or resolve data from external sources
 * 
 * @module hooks/content/usePropertyValueContent
 */

import { useState, useRef, useMemo } from 'react';
import { contentService } from '@services/content/ContentService';
import type { PropertyValueSectionData } from '@src/types';

export interface PropertyValueContent {
  content: {
    description: string;
    howWeEstimateLink: {
      text: string;
      url: string;
    };
    chart: {
      title: string;
    };
    valueHistory: {
      title: string;
      note: string;
      buttons: {
        seeMore: string;
        seeLess: string;
      };
    };
  };
  sortedData: Array<{ year: number; value: number }>;
  displayData: Array<{ year: number; value: number }>;
  tableData: Array<Record<string, string>>;
  formattedValue: string;
  showAllValues: boolean;
  setShowAllValues: React.Dispatch<React.SetStateAction<boolean>>;
  valueHistoryRef: React.RefObject<HTMLDivElement>;
  valueHistoryHeaderRef: React.RefObject<HTMLHeadingElement>;
  handleSeeMoreLess: () => void;
  sharedLabels: any;
}

/**
 * Hook for property value section content
 */
export function usePropertyValueContent(
  sectionData: PropertyValueSectionData
): PropertyValueContent {
  const content = contentService.getComponentContent('PropertyValueSection');
  const sharedLabels = contentService.getCommonContent().labels;
  const [showAllValues, setShowAllValues] = useState(false);
  const valueHistoryRef = useRef<HTMLDivElement>(null);
  const valueHistoryHeaderRef = useRef<HTMLHeadingElement>(null);

  // Convert data object to array of {year, value} pairs and sort by year
  const sortedData = useMemo(() => {
    return Object.entries(sectionData.historicPropertyValues)
      .map(([year, value]) => {
        // Ensure value is a valid number
        const numericValue = typeof value === 'number' ? value : parseFloat(value);
        if (isNaN(numericValue)) {
          return null;
        }
        return { year: parseInt(year), value: numericValue };
      })
      .filter((item): item is { year: number; value: number } => item !== null)
      .sort((a, b) => a.year - b.year);
  }, [sectionData.historicPropertyValues]);

  // Get either all data or just the latest 5 years (most recent, descending order)
  const displayData = useMemo(() => {
    return showAllValues ? [...sortedData].reverse() : [...sortedData].slice(-5).reverse();
  }, [sortedData, showAllValues]);

  // Format data for the table (descending order: latest to earliest)
  const tableData = useMemo(() => {
    return displayData.map(({ year, value }) => ({
      [sharedLabels.fiscalYear]: year.toString(),
      [sharedLabels.assessedValue]: value != null ? `$${value.toLocaleString()}` : 'N/A',
    }));
  }, [displayData, sharedLabels?.fiscalYear, sharedLabels?.assessedValue]);

  // Get the most recent value for the chart title
  const formattedValue = useMemo(() => {
    const mostRecentValue = sortedData[sortedData.length - 1]?.value;
    return mostRecentValue != null ? `$${mostRecentValue.toLocaleString()}` : 'N/A';
  }, [sortedData]);

  const handleSeeMoreLess = () => {
    if (showAllValues && valueHistoryRef.current) {
      // When clicking "See Less", scroll to the value history section
      valueHistoryRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    setShowAllValues((prev) => !prev);
  };

  return {
    content,
    sortedData,
    displayData,
    tableData,
    formattedValue,
    showAllValues,
    setShowAllValues,
    valueHistoryRef,
    valueHistoryHeaderRef,
    handleSeeMoreLess,
    sharedLabels,
  };
}

