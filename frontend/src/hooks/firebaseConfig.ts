/**
 * @file The FirebaseConfig file is used to manage the Firebase configuration, callable functions,
 * Firebase Authentication, Firebase App Check, Firebase Emulator, and initialize the Firebase app.
 */
import { initializeApp } from 'firebase/app';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { SearchPropertiesRequest, SearchPropertiesResponse } from '../types';

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

// Get Functions instance.
const functions = getFunctions(app);

// Export the callable function with authentication ensured.
export const saveFormData = async (data: any) => {
  const callable = httpsCallable(functions, 'saveFormData');
  return callable(data);
};

// Export the search properties callable function
export const searchProperties = async (request: SearchPropertiesRequest): 
Promise<SearchPropertiesResponse> => {
  const callable = httpsCallable
  <SearchPropertiesRequest, SearchPropertiesResponse>
  (functions, 'searchProperties');
  const result = await callable(request);
  return result.data;
};