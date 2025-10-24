/**
 * Approved Permits Content Hook - OWNS approved permits section content coordination
 * 
 * Responsibilities:
 * - Coordinates approved permits section display content
 * - Constructs permits URL with parcel ID
 * - Provides content from YAML
 * 
 * Does NOT:
 * - Create React elements
 * - Fetch permit data
 * - Handle state management
 * 
 * @module hooks/content/useApprovedPermitsContent
 */

import { contentService } from '@services/content/ContentService';

export interface ApprovedPermitsContent {
  content: any;
  pageContent: any;
  getPermitsUrl: (parcelId: string) => string;
}

/**
 * Hook for approved permits section content
 */
export function useApprovedPermitsContent(parcelId: string): ApprovedPermitsContent {
  const content = contentService.getComponentContent('ApprovedPermitsSection');
  const pageContent = contentService.getComponentContent('propertyDetails', 'pages.propertyDetails');
  
  const getPermitsUrl = (pid: string): string => {
    const url = content.description?.url || `https://www.boston.gov/departments/inspectional-services/search-building-and-zoning-permits?parcel_id={parcelId}`;
    return url.replace('{parcelId}', pid);
  };
  
  return {
    content,
    pageContent,
    getPermitsUrl,
  };
}

