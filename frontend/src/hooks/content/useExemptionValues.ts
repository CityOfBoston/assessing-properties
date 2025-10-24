/**
 * Exemption Values Hook - OWNS exemption value formatting logic
 * 
 * Responsibilities:
 * - Formats exemption values for display
 * - Determines "to be decided" vs actual values based on phase
 * - Handles N/A cases
 * 
 * Does NOT:
 * - Create React elements
 * - Determine phases
 * - Resolve content
 * 
 * @module hooks/content/useExemptionValues
 */

import { languageService, getStringValue } from '@services/content/LanguageService';
import type { StructuredDescription } from '@utils/periodsLanguage';

interface ExemptionValueParams {
  amount: number;
  granted: boolean;
  approved: boolean;
  isPrelimPeriod: boolean;
  formatTaxValue: (val: any) => string;
}

/**
 * Get formatted residential exemption value
 */
export function getResidentialExemptionValue(params: ExemptionValueParams): string {
  const { amount, granted, approved, isPrelimPeriod, formatTaxValue } = params;
  
  if (granted) {
    return isPrelimPeriod ? 'Amount to be decided' : `- ${formatTaxValue(amount)}`;
  }
  if (isPrelimPeriod && approved) {
    const value = languageService.getPropertyTaxMessage('to_be_decided');
    return typeof value === 'string' ? value : (value as StructuredDescription).text || 'Amount to be decided';
  }
  return formatTaxValue(amount) !== 'N/A' ? `- ${formatTaxValue(amount)}` : 'N/A';
}

/**
 * Get formatted personal exemption value
 */
export function getPersonalExemptionValue(params: ExemptionValueParams): string {
  const { amount, granted, approved, isPrelimPeriod, formatTaxValue } = params;
  
  if (granted) {
    return isPrelimPeriod ? 'Amount to be decided' : `- ${formatTaxValue(amount)}`;
  }
  if (isPrelimPeriod && approved) {
    const value = languageService.getPropertyTaxMessage('to_be_decided');
    return typeof value === 'string' ? value : (value as StructuredDescription).text || 'Amount to be decided';
  }
  return formatTaxValue(amount) !== 'N/A' ? `- ${formatTaxValue(amount)}` : 'N/A';
}

