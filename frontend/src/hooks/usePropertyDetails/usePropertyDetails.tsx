import { useState, useCallback } from 'react';
import { getPropertyDetails } from '../firebaseConfig';
import { PropertyDetailsData } from '../../types';

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
      setPropertyDetails(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const details = await getPropertyDetails(parcelId);
      setPropertyDetails(details);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while fetching property details'));
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