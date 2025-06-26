import { useState, useCallback } from 'react';
import { sendPropertyFeedback } from '../firebaseConfig';
import { FeedbackData } from '../../types';

interface UsePropertyFeedbackReturn {
  isLoading: boolean;
  error: Error | null;
  isSuccess: boolean;
  sendFeedback: (feedbackData: FeedbackData) => Promise<void>;
}

export const usePropertyFeedback = (): UsePropertyFeedbackReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const sendFeedback = useCallback(async (feedbackData: FeedbackData) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      await sendPropertyFeedback(feedbackData);
      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while sending feedback'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    isSuccess,
    sendFeedback,
  };
}; 