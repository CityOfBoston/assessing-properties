import periodsYaml from './periods.yaml';

// Type definitions for the YAML structure
interface PeriodsLanguage {
  periods: {
    timepoints: Record<string, string>;
    abatement_phases: Record<string, string>;
    exemption_phases: Record<string, string>;
    property_taxes: Record<string, string>;
    personal_exemption_links: Record<string, string>;
    abatements: Record<string, string>;
    overview: Record<string, string>;
    common: Record<string, string>;
  };
}

// Load the YAML data
const languageData: PeriodsLanguage = periodsYaml;

/**
 * Replace template variables in a string with provided values
 */
function replaceTemplateVariables(template: string, variables: Record<string, any>): string {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return variables[key] !== undefined ? String(variables[key]) : match;
  });
}

/**
 * Get a language string with template variable replacement
 */
export function getLanguageString(
  path: string, 
  variables: Record<string, any> = {}
): string {
  const keys = path.split('.');
  let value: any = languageData;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Language key not found: ${path}`);
      return path; // Return the path as fallback
    }
  }
  
  if (typeof value === 'string') {
    return replaceTemplateVariables(value, variables);
  }
  
  console.warn(`Language value is not a string: ${path}`);
  return path;
}

/**
 * Get a language string without template replacement
 */
export function getLanguageStringRaw(path: string): string {
  const keys = path.split('.');
  let value: any = languageData;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key];
    } else {
      console.warn(`Language key not found: ${path}`);
      return path;
    }
  }
  
  return typeof value === 'string' ? value : path;
}

// Export commonly used language strings as functions
export const getTimepointLabel = (key: string) => getLanguageStringRaw(`periods.timepoints.${key}`);
export const getAbatementPhaseMessage = (phase: string, variables: Record<string, any>) => 
  getLanguageString(`periods.abatement_phases.${phase}`, variables);
export const getExemptionPhaseMessage = (phase: string, variables: Record<string, any>) => 
  getLanguageString(`periods.exemption_phases.${phase}`, variables);
export const getPropertyTaxMessage = (key: string, variables: Record<string, any> = {}) => 
  getLanguageString(`periods.property_taxes.${key}`, variables);
export const getPersonalExemptionLink = (key: string) => getLanguageStringRaw(`periods.personal_exemption_links.${key}`);
export const getPersonalExemptionLabel = (key: string) => getLanguageStringRaw(`periods.personal_exemption_links.${key}_label`);
export const getAbatementMessage = (key: string) => getLanguageStringRaw(`periods.abatements.${key}`);
export const getOverviewMessage = (key: string) => getLanguageStringRaw(`periods.overview.${key}`);
export const getCommonValue = (key: string) => getLanguageStringRaw(`periods.common.${key}`); 