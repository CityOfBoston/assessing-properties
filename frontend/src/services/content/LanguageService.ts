/**
 * Language Service - OWNS language string resolution and formatting
 * 
 * Responsibilities:
 * - Resolves language strings from periods.yaml
 * - Handles template variable replacement
 * - Provides type-safe access to structured content (links, phones)
 * - Manages time-period specific messaging
 * 
 * Does NOT:
 * - Determine which phase or period we're in (that's periods.ts)
 * - Create React elements
 * - Handle business logic
 * - Manage application state
 * 
 * @module services/content/LanguageService
 */

import { 
  getLanguageString, 
  getLanguageStringRaw,
  getTimepointLabel,
  getAbatementPhaseMessage,
  getExemptionPhaseMessage,
  getPropertyTaxMessage,
  getPersonalExemptionLink,
  getPersonalExemptionLabel,
  getAbatementMessage,
  getOverviewMessage,
  getCommonValue,
  type StructuredDescription 
} from '@utils/periodsLanguage';

export class LanguageService {
  private static instance: LanguageService;
  
  /**
   * Get singleton instance of LanguageService
   */
  static getInstance(): LanguageService {
    if (!this.instance) {
      this.instance = new LanguageService();
    }
    return this.instance;
  }

  /**
   * Get a language string with template variable replacement
   */
  getString(
    path: string, 
    variables: Record<string, any> = {}
  ): string | StructuredDescription {
    return getLanguageString(path, variables);
  }

  /**
   * Get a language string without template replacement
   */
  getRawString(path: string): string {
    return getLanguageStringRaw(path);
  }

  // Convenience methods for commonly used language strings
  getTimepointLabel(key: string): string {
    return getTimepointLabel(key);
  }

  getAbatementPhaseMessage(
    phase: string, 
    variables: Record<string, any>, 
    parcelId?: string
  ): string | StructuredDescription {
    return getAbatementPhaseMessage(phase, variables, parcelId);
  }

  getExemptionPhaseMessage(
    phase: string, 
    variables: Record<string, any>
  ): string | StructuredDescription {
    return getExemptionPhaseMessage(phase, variables);
  }

  getPropertyTaxMessage(
    key: string, 
    variables: Record<string, any> = {}
  ): string | StructuredDescription {
    return getPropertyTaxMessage(key, variables);
  }

  getPersonalExemptionLink(key: string): string {
    return getPersonalExemptionLink(key);
  }

  getPersonalExemptionLabel(key: string): string {
    return getPersonalExemptionLabel(key);
  }

  getAbatementMessage(key: string): string {
    return getAbatementMessage(key);
  }

  getOverviewMessage(key: string): string {
    return getOverviewMessage(key);
  }

  getCommonValue(key: string): string {
    return getCommonValue(key);
  }
}

// Export singleton instance for convenience
export const languageService = LanguageService.getInstance();

// Helper functions to handle language string types
export function getStringValue(value: string | StructuredDescription): string {
  if (typeof value === 'string') {
    return value;
  }
  return value.text || '';
}

export function getUrlValue(value: string | StructuredDescription): string {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'object' && value !== null && 'url' in value && typeof value.url === 'string') {
    return value.url;
  }
  return '';
}

