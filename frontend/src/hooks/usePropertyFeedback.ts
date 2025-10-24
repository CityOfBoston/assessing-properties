import { useState, useCallback } from 'react';
import { storePropertyFeedback } from './firebaseConfig';
import type { FeedbackData } from '../types';

interface UsePropertyFeedbackReturn {
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
  sendFeedback: (feedback: FeedbackData) => Promise<void>;
  reset: () => void;
}

export const usePropertyFeedback = (): UsePropertyFeedbackReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const sendFeedback = useCallback(async (feedback: FeedbackData) => {
    // Validate based on feedback type
    if (feedback.type === 'property' && !feedback.parcelId?.trim()) {
      throw new Error('Parcel ID is required for property feedback');
    }
    
    if (feedback.type === 'general' && !feedback.issueType?.trim()) {
      throw new Error('Issue type is required for general feedback');
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);
      
      await storePropertyFeedback(feedback);
      
      setIsSuccess(true);
    } catch (err) {
      console.error('[usePropertyFeedback] Error sending feedback:', err);
      setError(err instanceof Error ? err : new Error('Failed to send feedback'));
      setIsSuccess(false);
      throw err; // Re-throw to allow container to handle
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setIsSuccess(false);
  }, []);

  return {
    isLoading,
    error,
    isSuccess,
    sendFeedback,
    reset,
  };
}; 