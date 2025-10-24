/**
 * Property Details Content Hook - MAIN COORDINATOR for property details content
 * 
 * Responsibilities:
 * - Acts as the main entry point for property details content
 * - Re-exports all specialized content hooks
 * - Maintains backward compatibility with existing components
 * 
 * Does NOT:
 * - Contain business logic (delegated to specialized hooks)
 * - Create React elements (delegated to presenters)
 * - Resolve content directly (delegated to services)
 * 
 * Architecture:
 * - Content resolution: ContentService, LanguageService
 * - Business logic: usePropertyTaxCalculations, useExemptionPhases
 * - Presentation: ExemptionPresenter, PropertyTaxPresenter
 * - Coordination: Specialized content hooks in hooks/content/
 * 
 * @module hooks/usePropertyDetailsContent
 */

// Re-export all specialized content hooks
export { usePropertyTaxesContent } from './content/usePropertyTaxesContent';
export { usePropertyValueContent } from './content/usePropertyValueContent';
export { useOverviewContent } from './content/useOverviewContent';
export { useAttributesContent } from './content/useAttributesContent';
export { useContactUsContent } from './content/useContactUsContent';
export { useAbatementsContent } from './content/useAbatementsContent';
export { useApprovedPermitsContent } from './content/useApprovedPermitsContent';

// Re-export types for convenience
export type { PropertyTaxContent } from './content/usePropertyTaxesContent';
export type { PropertyValueContent } from './content/usePropertyValueContent';
export type { OverviewContent } from './content/useOverviewContent';
export type { AttributesContent } from './content/useAttributesContent';
export type { ContactUsContent } from './content/useContactUsContent';
export type { AbatementsContent } from './content/useAbatementsContent';
export type { ApprovedPermitsContent } from './content/useApprovedPermitsContent';

// Re-export helper functions from services for backward compatibility
export { getStringValue, getUrlValue } from '@services/content/LanguageService';
export { renderMarkdown, getMarkdownText as getReactMarkdownValue } from '@utils/markdown/markdownRenderer';
