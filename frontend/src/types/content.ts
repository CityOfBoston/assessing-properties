// Content type definitions for the application

// Common text that might be reused across pages
export interface CommonContent {
  errors: {
    general: string;
    notFound: string;
    loading: string;
  };
  buttons: {
    search: string;
    clear: string;
    back: string;
    details: string;
  };
}

// Component prop interfaces - these define the text props each component accepts
export interface WelcomeContentProps {
  title: string;
  description: string;
  logoAltText: string;
}

export interface SearchBarProps {
  labelText: string;
  helperText: string;
  placeholderText: string;
}

export interface SearchTip {
  title: string;
  description: string;
}

// Page-specific content interfaces
export interface WelcomePageContent {
  hero: WelcomeContentProps;
  search: SearchBarProps;
}

export interface SearchResultsPageContent {
  hero: WelcomeContentProps;
  search: SearchBarProps;
  results: {
    title: string;
    noResults: string;
    loading: string;
    resultsCount: string;
  };
  searchTips: {
    title: string;
    tips: SearchTip[];
  };
}

// Full application content structure
export interface AppContent {
  common: CommonContent;
  pages: {
    welcome: WelcomePageContent;
    searchResults: SearchResultsPageContent;
  };
}

// Helper function to get content for a specific page
export function getPageContent<K extends keyof AppContent['pages']>(
  content: AppContent,
  pageName: K
): AppContent['pages'][K] {
  return content.pages[pageName];
}

// Helper function to get common content
export function getCommonContent(content: AppContent): CommonContent {
  return content.common;
}