// Event Categories
export enum AnalyticsEventCategory {
  Search = 'search',
  Property = 'property',
  Navigation = 'navigation',
  Feedback = 'feedback',
  UI = 'ui',
  Performance = 'performance',
  Error = 'error'
}

// Event Actions
export enum AnalyticsEventAction {
  // Search Events
  Search = 'search',
  SearchSuggestionClick = 'search_suggestion_click',
  SearchFilterChange = 'search_filter_change',
  SearchError = 'search_error',

  // Property Events
  ViewProperty = 'view_property',
  ExportProperty = 'export_property',
  ViewPropertyHistory = 'view_property_history',
  ViewPropertyMap = 'view_property_map',
  ViewPropertyStreetView = 'view_property_streetview',
  ViewPropertyAbatements = 'view_property_abatements',

  // Navigation Events
  PageView = 'page_view',
  BackToTop = 'back_to_top',
  ExternalLinkClick = 'external_link_click',

  // Feedback Events
  SubmitFeedback = 'submit_feedback',
  FeedbackError = 'feedback_error',

  // UI Events
  ToggleAccordion = 'toggle_accordion',
  ToggleHelp = 'toggle_help',
  ClosePopup = 'close_popup',
  OpenPopup = 'open_popup',

  // Performance Events
  ApiCallStart = 'api_call_start',
  ApiCallEnd = 'api_call_end',
  ComponentRender = 'component_render',
  
  // Error Events
  ApplicationError = 'application_error',
  NetworkError = 'network_error'
}

// Event Parameter Types
export interface SearchEventParams {
  query?: string;
  filter_type?: string;
  results_count?: number;
  suggestion_type?: string;
  error_type?: string;
}

export interface PropertyEventParams {
  parcel_id: string;
  property_type?: string;
  section_name?: string;
  export_format?: string;
  error_type?: string;
}

export interface NavigationEventParams {
  from_page?: string;
  to_page?: string;
  link_url?: string;
  link_type?: string;
  page_title?: string;
}

export interface FeedbackEventParams {
  feedback_type: string;
  feedback_source: string;
  error_type?: string;
}

export interface UIEventParams {
  element_id: string;
  element_type: string;
  element_value?: string;
  previous_state?: string;
  new_state?: string;
}

export interface PerformanceEventParams {
  component_name?: string;
  operation_name?: string;
  duration?: number;
  status?: string;
  error?: string;
}

export interface ErrorEventParams {
  error_type: string;
  error_message: string;
  error_stack?: string;
  component?: string;
}

// Union type for all event parameters
export type AnalyticsEventParams =
  | SearchEventParams
  | PropertyEventParams
  | NavigationEventParams
  | FeedbackEventParams
  | UIEventParams
  | PerformanceEventParams
  | ErrorEventParams;

// Analytics Event interface
export interface AnalyticsEvent {
  category: AnalyticsEventCategory;
  action: AnalyticsEventAction;
  params?: AnalyticsEventParams;
}
