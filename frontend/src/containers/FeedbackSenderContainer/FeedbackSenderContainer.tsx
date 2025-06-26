import { usePropertyFeedback } from '../../hooks/usePropertyFeedback';
import { FeedbackSender, FeedbackSenderProps } from '../../components/FeedbackSender/FeedbackSender';
import { useCallback } from 'react';
import { FeedbackData } from '../../types';

interface FeedbackSenderContainerProps extends Omit<FeedbackSenderProps, 'onSubmit'> {
  /**
   * Optional callback when feedback is successfully sent
   */
  onSuccess?: () => void;
  
  /**
   * Optional callback when feedback fails to send
   */
  onError?: (error: Error) => void;
}

export const FeedbackSenderContainer = ({
  onSuccess,
  onError,
  ...feedbackSenderProps
}: FeedbackSenderContainerProps) => {
  const { isLoading, error, isSuccess, sendFeedback } = usePropertyFeedback();

  const handleSubmit = useCallback(async (data: { 
    helpful: boolean; 
    feedback?: string; 
    parcelId?: string 
  }) => {
    if (!data.parcelId) {
      console.warn('[FeedbackSenderContainer] No parcelId provided, skipping feedback submission');
      return;
    }

    const feedbackData: FeedbackData = {
      parcelId: data.parcelId,
      hasPositiveSentiment: data.helpful,
      feedbackMessage: data.feedback,
    };

    try {
      await sendFeedback(feedbackData);
      onSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to send feedback');
      onError?.(error);
    }
  }, [sendFeedback, onSuccess, onError]);

  return (
    <FeedbackSender
      {...feedbackSenderProps}
      onSubmit={handleSubmit}
    />
  );
}; 