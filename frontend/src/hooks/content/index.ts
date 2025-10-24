/**
 * Content Hooks - Central export for content coordination hooks
 * 
 * @module hooks/content
 */

export { usePropertyTaxesContent } from './usePropertyTaxesContent';
export type { PropertyTaxContent } from './usePropertyTaxesContent';

export { usePropertyValueContent } from './usePropertyValueContent';
export type { PropertyValueContent } from './usePropertyValueContent';

export { useOverviewContent } from './useOverviewContent';
export type { OverviewContent, OverviewCard } from './useOverviewContent';

export { useAttributesContent } from './useAttributesContent';
export type { AttributesContent } from './useAttributesContent';

export { useContactUsContent } from './useContactUsContent';
export type { ContactUsContent } from './useContactUsContent';

export { useAbatementsContent } from './useAbatementsContent';
export type { AbatementsContent } from './useAbatementsContent';

export { useApprovedPermitsContent } from './useApprovedPermitsContent';
export type { ApprovedPermitsContent } from './useApprovedPermitsContent';

export { getResidentialExemptionValue, getPersonalExemptionValue } from './useExemptionValues';

