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
    if (!feedback.parcelId?.trim()) {
      throw new Error('Parcel ID is required');
    }

    try {
      setIsLoading(true);
      setError(null);
      setIsSuccess(false);
      
      console.log('[usePropertyFeedback] Sending feedback for parcelId:', feedback.parcelId);
      
      await storePropertyFeedback(feedback);
      
      console.log('[usePropertyFeedback] Successfully sent feedback');
      
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