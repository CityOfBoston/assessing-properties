/**
 * Contact Us Content Hook - OWNS contact us section content coordination
 * 
 * Responsibilities:
 * - Provides contact us section content from YAML
 * - Simple content resolution only
 * 
 * Does NOT:
 * - Create React elements
 * - Handle business logic
 * - Manage state
 * 
 * @module hooks/content/useContactUsContent
 */

import { contentService } from '@services/content/ContentService';

export interface ContactUsContent {
  content: any;
}

/**
 * Hook for contact us section content
 */
export function useContactUsContent(): ContactUsContent {
  const content = contentService.getComponentContent('ContactUsSection');
  
  return {
    content,
  };
}

