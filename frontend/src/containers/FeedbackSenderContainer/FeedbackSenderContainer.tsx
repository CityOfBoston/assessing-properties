import { usePropertyFeedback } from '@hooks/usePropertyFeedback';
import { FeedbackSender, FeedbackSenderProps } from '../../components/FeedbackSender/FeedbackSender';
import { useCallback, useEffect } from 'react';
import { FeedbackData } from '../../types';
import styles from './FeedbackSenderContainer.module.scss';

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
  const { isLoading, error, isSuccess, sendFeedback, reset } = usePropertyFeedback();

  // Handle success callback
  useEffect(() => {
    if (isSuccess) {
      onSuccess?.();
    }
  }, [isSuccess, onSuccess]);

  // Handle error callback
  useEffect(() => {
    if (error) {
      onError?.(error);
    }
  }, [error, onError]);

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
    } catch (err) {
      // Error is already handled by the hook and passed to onError via useEffect
      console.error('[FeedbackSenderContainer] Error in handleSubmit:', err);
    }
  }, [sendFeedback]);

  if (isSuccess) {
    return (
      <div className={styles.successMessage}>
        Thank you for your feedback.
      </div>
    );
  }

  return (
    <FeedbackSender
      {...feedbackSenderProps}
      onSubmit={handleSubmit}
    />
  );
}; 