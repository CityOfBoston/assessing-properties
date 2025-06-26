/**
 * @file The FirebaseConfig file is used to manage the Firebase configuration, callable functions,
 * Firebase Authentication, Firebase App Check, Firebase Emulator, and initialize the Firebase app.
 */
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import type { PropertySearchSuggestions, PropertyDetailsData, PropertySearchResults, 
  FeedbackData } from '../types';

// Firebase configuration.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app.
const app = initializeApp(firebaseConfig);

// Generic response type for all Firebase callable functions
interface FirebaseResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Helper function to handle Firebase callable function responses
async function callFirebaseFunction<T, R>(
  callableFunction: any,
  params: T
): Promise<R> {
  try {
    const result = await callableFunction(params);
    const response: FirebaseResponse<R> = result.data;
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      return response.data;
    } else {
      throw new Error(`Firebase function error: ${response.message}`);
    }
  } catch (error) {
    console.error('Firebase function call failed:', error);
    throw error;
  }
}

// Abstracted getFunctions call
const functions = getFunctions(app, 'us-central1');

// Callable function getSearchSuggestions that takes a sequenceString and 
// returns a PropertySearchSuggestions
const getSearchSuggestionsCallable = httpsCallable<
  { sequenceString: string }, 
  FirebaseResponse<PropertySearchSuggestions>
>(functions, 'getSearchSuggestions');

export const getSearchSuggestions = (sequenceString: string) =>
  callFirebaseFunction<{ sequenceString: string }, PropertySearchSuggestions>(
    getSearchSuggestionsCallable,
    { sequenceString }
  );

// Callable function getSearchResults that takes a sequenceString and 
// returns a PropertySearchResults object
const getSearchResultsCallable = httpsCallable<
  { sequenceString: string }, 
  FirebaseResponse<PropertySearchResults>
>(functions, 'getSearchResults');

export const getSearchResults = (sequenceString: string) =>
  callFirebaseFunction<{ sequenceString: string }, PropertySearchResults>(
    getSearchResultsCallable,
    { sequenceString }
  );

// Callable function getPropertyDetails that takes a parcelId and 
// returns a PropertyDetailsData object
const getPropertyDetailsCallable = httpsCallable<
  { parcelId: string }, 
  FirebaseResponse<PropertyDetailsData>
>(functions, 'getPropertyDetails');

export const getPropertyDetails = (parcelId: string) =>
  callFirebaseFunction<{ parcelId: string }, PropertyDetailsData>(
    getPropertyDetailsCallable,
    { parcelId }
  );

// Callable function postPropertyFeedback that takes a feedbackData object and 
// returns a void
const postPropertyFeedbackCallable = httpsCallable<
  { feedbackData: FeedbackData }, 
  FirebaseResponse<void>
>(functions, 'postPropertyFeedback');

export const sendPropertyFeedback = (feedbackData: FeedbackData) =>
  callFirebaseFunction<{ feedbackData: FeedbackData }, void>(
    postPropertyFeedbackCallable,
    { feedbackData }
  );