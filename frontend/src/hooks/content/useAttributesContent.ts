/**
 * Attributes Content Hook - OWNS attributes section content coordination
 * 
 * Responsibilities:
 * - Coordinates attributes section display content
 * - Manages show/hide state for attributes list
 * - Handles scrolling behavior when toggling
 * - Provides content and labels from YAML
 * 
 * Does NOT:
 * - Perform data transformations
 * - Create complex React elements
 * - Handle business logic
 * 
 * @module hooks/content/useAttributesContent
 */

import { useState, useRef } from 'react';
import { contentService } from '@services/content/ContentService';
import type { PropertyAttributesData } from '@src/types';

export interface AttributesContent {
  content: any;
  sharedButtons: any;
  sharedLabels: any;
  showAllAttributes: boolean;
  setShowAllAttributes: React.Dispatch<React.SetStateAction<boolean>>;
  sectionRef: React.RefObject<HTMLDivElement>;
  handleToggle: () => void;
}

/**
 * Hook for attributes section content
 */
export function useAttributesContent(data: PropertyAttributesData): AttributesContent {
  const content = contentService.getComponentContent('AttributesSection');
  const sharedButtons = contentService.getCommonContent().buttons;
  const sharedLabels = contentService.getCommonContent().labels;
  const [showAllAttributes, setShowAllAttributes] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    if (showAllAttributes) {
      // When clicking "See Less", scroll to the top of the section
      sectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    setShowAllAttributes(!showAllAttributes);
  };

  return {
    content,
    sharedButtons,
    sharedLabels,
    showAllAttributes,
    setShowAllAttributes,
    sectionRef,
    handleToggle,
  };
}

