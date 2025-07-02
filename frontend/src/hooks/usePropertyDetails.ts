import { useState, useCallback } from 'react';
import { fetchPropertyDetailsByParcelId } from './firebaseConfig';
import type { PropertyDetailsData } from '../types';

interface UsePropertyDetailsReturn {
  propertyDetails: PropertyDetailsData | null;
  isLoading: boolean;
  error: Error | null;
  fetchPropertyDetails: (parcelId: string) => Promise<void>;
}

export const usePropertyDetails = (): UsePropertyDetailsReturn => {
  const [propertyDetails, setPropertyDetails] = useState<PropertyDetailsData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchPropertyDetails = useCallback(async (parcelId: string) => {
    if (!parcelId.trim()) {
      setError(new Error('Parcel ID is required'));
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('[usePropertyDetails] Fetching property details for parcelId:', parcelId);
      
      const details = await fetchPropertyDetailsByParcelId(parcelId);
      
      console.log('[usePropertyDetails] Successfully fetched property details:', details);
      
      setPropertyDetails(details);
    } catch (err) {
      console.error('[usePropertyDetails] Error fetching property details:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch property details'));
      setPropertyDetails(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    propertyDetails,
    isLoading,
    error,
    fetchPropertyDetails,
  };
}; 