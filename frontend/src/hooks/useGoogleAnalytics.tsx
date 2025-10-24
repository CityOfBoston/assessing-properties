import React, { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analyticsService } from '@src/services/analytics';
import type {
  SearchEventParams,
  NavigationEventParams,
  ErrorEventParams
} from '@src/types/analytics';

interface GoogleAnalyticsContextType {
  trackSearch: (params: SearchEventParams) => void;
  trackSearchSuggestionClick: (params: SearchEventParams) => void;
  trackSearchFilterChange: (params: SearchEventParams) => void;
  trackPageView: (params: NavigationEventParams) => void;
  trackButtonClick: (params: { button_id: string; button_text: string; context?: string }) => void;
  trackLinkClick: (params: { link_url: string; link_text: string; context?: string }) => void;
  trackError: (params: ErrorEventParams) => void;
}

const GoogleAnalyticsContext = createContext<GoogleAnalyticsContextType>({
  trackSearch: () => {},
  trackSearchSuggestionClick: () => {},
  trackSearchFilterChange: () => {},
  trackPageView: () => {},
  trackButtonClick: () => {},
  trackLinkClick: () => {},
  trackError: () => {},
});

export const GoogleAnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  // Track page views automatically when the location changes
  useEffect(() => {
    // Skip if this is the initial mount with no hash
    if (!location.hash && !location.search) return;

    // Get the path and search params, handling both hash and direct navigation
    let cleanPath = '/';
    let searchParams = location.search;

    // If we have a hash path, use that instead
    if (location.hash) {
      const hashPath = location.hash.slice(1);
      const [pathPart, searchPart] = hashPath.split('?');
      cleanPath = pathPart || '/';
      searchParams = searchPart ? `?${searchPart}` : '';
    } else if (location.pathname !== '/') {
      // If no hash but we have a pathname, use that
      cleanPath = location.pathname;
    }
    
    // Get the page title and potentially update the path based on parameters
    let pageTitle = 'Welcome';
    const params = new URLSearchParams(searchParams);
    const parcelId = params.get('parcelId');
    const searchQuery = params.get('q');

    // Determine page title and path based on parameters and current path
    if (cleanPath === '/details' || parcelId) {
      cleanPath = '/details';
      pageTitle = `Property Details - ${parcelId}`;
    } else if (cleanPath === '/search' || searchQuery) {
      cleanPath = '/search';
      pageTitle = searchQuery ? `Search Results - ${searchQuery}` : 'Search Results';
    } else if (cleanPath === '/maintenance') {
      pageTitle = 'Maintenance';
    }

    const currentPath = cleanPath + searchParams;


    // Send the page view event
    analyticsService.trackPageView({
      to_page: currentPath,
      from_page: document.referrer,
      page_title: pageTitle
    });
  }, [location]);

  const value: GoogleAnalyticsContextType = {
    trackSearch: analyticsService.trackSearch.bind(analyticsService),
    trackSearchSuggestionClick: analyticsService.trackSearchSuggestionClick.bind(analyticsService),
    trackSearchFilterChange: analyticsService.trackSearchFilterChange.bind(analyticsService),
    trackPageView: analyticsService.trackPageView.bind(analyticsService),
    trackButtonClick: analyticsService.trackButtonClick.bind(analyticsService),
    trackLinkClick: analyticsService.trackLinkClick.bind(analyticsService),
    trackError: analyticsService.trackError.bind(analyticsService),
  };

  return (
    <GoogleAnalyticsContext.Provider value={value}>
      {children}
    </GoogleAnalyticsContext.Provider>
  );
};

export const useGoogleAnalytics = () => {
  const context = useContext(GoogleAnalyticsContext);
  if (!context) {
    throw new Error('useGoogleAnalytics must be used within a GoogleAnalyticsProvider');
  }
  return context;
};
