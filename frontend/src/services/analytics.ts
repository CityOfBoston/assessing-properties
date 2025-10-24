import {
  AnalyticsEvent,
  AnalyticsEventCategory,
  AnalyticsEventAction,
  SearchEventParams,
  PropertyEventParams,
  NavigationEventParams,
  FeedbackEventParams,
  UIEventParams,
  PerformanceEventParams,
  ErrorEventParams
} from '@src/types/analytics';

class AnalyticsService {
  private readonly measurementId: string;
  private initialized: boolean = false;

  constructor() {
    this.measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID;
    if (!this.measurementId) {
      console.warn('Google Analytics Measurement ID not found in environment variables. Analytics will be disabled.');
      return;
    }
    this.initializeGA();
  }

  private initializeGA() {
    if (!this.measurementId || this.initialized) return;

    // Load GA script first
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
    
    // Initialize after script loads
    script.onload = () => {
      // Initialize dataLayer
      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){window.dataLayer.push(arguments);};

      // Initialize GA base configuration
      window.gtag('js', new Date());
      
      // Initial config call
      window.gtag('config', this.measurementId, {
        send_page_view: false,
        debug_mode: true,
        cookie_domain: 'auto'
      });

      this.initialized = true;

    };

    document.head.appendChild(script);
  }

  private trackEvent(event: AnalyticsEvent) {
    if (window.gtag && this.initialized) {
      window.gtag('event', event.action, {
        event_category: event.category,
        ...event.params
      });

    }
  }

  // Search Events
  trackSearch(params: SearchEventParams) {
    this.trackEvent({
      category: AnalyticsEventCategory.Search,
      action: AnalyticsEventAction.Search,
      params
    });
  }

  trackSearchSuggestionClick(params: SearchEventParams) {
    this.trackEvent({
      category: AnalyticsEventCategory.Search,
      action: AnalyticsEventAction.SearchSuggestionClick,
      params
    });
  }

  trackSearchFilterChange(params: SearchEventParams) {
    this.trackEvent({
      category: AnalyticsEventCategory.Search,
      action: AnalyticsEventAction.SearchFilterChange,
      params
    });
  }

  // Button Events
  trackButtonClick(params: { button_id: string; context?: string }) {
    this.trackEvent({
      category: 'interaction',
      action: 'button_click',
      params
    });
  }

  // Navigation Events
  trackPageView(params: NavigationEventParams) {
    if (!window.gtag) {
      if (import.meta.env.DEV) {
        console.warn('GA not available, skipping page view');
      }
      return;
    }

    try {
      const pagePath = params.to_page;
      // For HashRouter, we need to include the hash in the page_location
      const pageLocation = window.location.origin + (window.location.hash || '') + (window.location.search || '');
      
      // Also send the page_path with hash for consistency
      const pagePathWithHash = window.location.hash ? window.location.hash.slice(1) : pagePath;

      // Send only the config update with page view
      window.gtag('config', this.measurementId, {
        page_title: params.page_title,
        page_path: pagePathWithHash,
        page_location: pageLocation,
        send_page_view: true
      });

      if (import.meta.env.DEV) {
        const eventCount = parseInt(sessionStorage.getItem('gaEventCount') || '0') + 1;
        sessionStorage.setItem('gaEventCount', eventCount.toString());
        
        console.log('📊 GA4 Page View Sent:', {
          'Event Count': eventCount,
          'Measurement ID': this.measurementId,
          'Page Title': params.page_title,
          'Page Path (sent to GA)': pagePathWithHash,
          'Page Location (sent to GA)': pageLocation,
          'Original Page Path': pagePath,
          'Full URL': window.location.href,
          'Hash Route': window.location.hash,
          'Search Params': window.location.search,
          'Time Since Last Event': Date.now() - parseInt(sessionStorage.getItem('lastTrackedTime') || '0') + 'ms',
          'Timestamp': new Date().toISOString()
        });
      }
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error tracking page view:', error);
      }
    }
  }

  trackLinkClick(params: { link_url: string; link_text: string; context?: string }) {
    this.trackEvent({
      category: 'interaction',
      action: 'link_click',
      params
    });
  }

  // Performance Events
  trackAPICall(params: PerformanceEventParams) {
    const action = params.status === 'start' 
      ? AnalyticsEventAction.ApiCallStart 
      : AnalyticsEventAction.ApiCallEnd;
    
    this.trackEvent({
      category: AnalyticsEventCategory.Performance,
      action,
      params
    });
  }

  trackComponentRender(params: PerformanceEventParams) {
    this.trackEvent({
      category: AnalyticsEventCategory.Performance,
      action: 'load_results',
      params: {
        ...params,
        event_type: 'results_load'
      }
    });
  }

  // Error Events
  trackError(params: ErrorEventParams) {
    this.trackEvent({
      category: AnalyticsEventCategory.Error,
      action: params.error_type === 'network' 
        ? AnalyticsEventAction.NetworkError 
        : AnalyticsEventAction.ApplicationError,
      params
    });
  }
}

export const analyticsService = new AnalyticsService();

// Performance monitoring hook
export const usePerformanceTracking = (componentName: string) => {
  const now = () => window.performance.now();
  
  return {
    trackRender: (duration: number) => {
      analyticsService.trackComponentRender({
        component_name: componentName,
        duration
      });
    },
    trackOperation: (operationName: string, status: string, duration?: number, error?: string) => {
      analyticsService.trackAPICall({
        component_name: componentName,
        operation_name: operationName,
        status,
        duration,
        error
      });
    },
    now // Expose the now function for timing operations
  };
};
