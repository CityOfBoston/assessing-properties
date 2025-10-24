import content from '@utils/content.yaml';

type ContentReference = string | Record<string, any>;

/**
 * Resolves a reference path in the content configuration
 * @param path Path to resolve (e.g., "@shared.labels.beta")
 * @param context Current content context
 * @returns Resolved value
 */
function resolveReference(path: string, context: Record<string, any> = content): any {
  if (typeof path !== 'string' || !path.startsWith('@')) {
    return path;
  }

  const actualPath = path.substring(1); // Remove '@' prefix
  return actualPath.split('.').reduce((obj, key) => obj?.[key], context);
}

/**
 * Recursively resolves all references in an object
 * @param obj Object to resolve references in
 * @param context Current content context
 * @returns New object with resolved references
 */
function resolveReferences(obj: ContentReference, context: Record<string, any> = content): any {
  if (typeof obj === 'string') {
    return resolveReference(obj, context);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => resolveReferences(item, context));
  }

  if (typeof obj === 'object' && obj !== null) {
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = resolveReferences(value, context);
    }
    return result;
  }

  return obj;
}

/**
 * Gets component text props from the content configuration
 * @param componentName Name of the component (e.g., "WelcomeContent")
 * @param instancePath Optional path to specific instance configuration (e.g., "pages.welcome.hero")
 * @returns Resolved text props for the component
 */
export function getComponentText(componentName: string, instancePath?: string): Record<string, any> {
  // Handle special sections
  if (componentName === 'common') {
    return resolveReferences(content.shared);
  }
  if (componentName === 'config') {
    return resolveReferences(content.config);
  }

  // Get base component text configuration
  let baseConfig;
  if (instancePath?.startsWith('layouts.')) {
    baseConfig = content.layouts[componentName];
  } else if (instancePath?.startsWith('pages.')) {
    // For pages, we don't need a base config, just get the instance config
    baseConfig = {};
  } else {
    baseConfig = content.components[componentName];
  }
  if (!baseConfig && !instancePath?.startsWith('pages.')) {
    console.warn(`No text configuration found for component: ${componentName}`);
    return {};
  }

  // If no instance path provided, just resolve the base config
  if (!instancePath) {
    return resolveReferences(baseConfig);
  }

  // Get instance-specific configuration
  const instanceConfig = instancePath.split('.').reduce((obj, key) => obj?.[key], content);
  if (!instanceConfig) {
    console.warn(`No instance configuration found at path: ${instancePath}`);
    return resolveReferences(baseConfig);
  }

  // For pages, return the full instance config
  if (instancePath.startsWith('pages.')) {
    return resolveReferences(instanceConfig);
  }

  // For other paths, merge and resolve instance config with base config
  return resolveReferences({
    ...baseConfig,
    ...instanceConfig.props
  });
}

/**
 * Example usage:
 * 
 * // Get base component text
 * const welcomeText = getComponentText('WelcomeContent');
 * 
 * // Get instance-specific text
 * const welcomeHeroText = getComponentText('WelcomeContent', 'pages.welcome.hero');
 * 
 * // Use in a component
 * function MyComponent() {
 *   const texts = getComponentText('MyComponent', 'pages.myPage.mySection');
 *   return <div>{texts.someText}</div>;
 * }
 */
