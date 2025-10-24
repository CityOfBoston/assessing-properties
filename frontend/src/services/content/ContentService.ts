/**
 * Content Service - OWNS content resolution and access
 * 
 * Responsibilities:
 * - Provides centralized access to component content from YAML
 * - Resolves @ references in YAML content
 * - Merges base and instance configurations
 * - Ensures type-safe content access
 * 
 * Does NOT:
 * - Handle business logic or calculations
 * - Create React elements or components
 * - Manage application state
 * - Perform data transformations
 * 
 * @module services/content/ContentService
 */

import { getComponentText } from '@utils/contentMapper';

export class ContentService {
  private static instance: ContentService;
  
  /**
   * Get singleton instance of ContentService
   */
  static getInstance(): ContentService {
    if (!this.instance) {
      this.instance = new ContentService();
    }
    return this.instance;
  }

  /**
   * Get component content from YAML configuration
   * @param componentName Name of the component (e.g., "WelcomeContent")
   * @param instancePath Optional path to specific instance configuration
   * @returns Resolved content for the component
   */
  getComponentContent<T = Record<string, any>>(
    componentName: string, 
    instancePath?: string
  ): T {
    return getComponentText(componentName, instancePath) as T;
  }

  /**
   * Get common/shared content
   */
  getCommonContent<T = Record<string, any>>(): T {
    return getComponentText('common') as T;
  }

  /**
   * Get config content
   */
  getConfigContent<T = Record<string, any>>(): T {
    return getComponentText('config') as T;
  }
}

// Export singleton instance for convenience
export const contentService = ContentService.getInstance();

