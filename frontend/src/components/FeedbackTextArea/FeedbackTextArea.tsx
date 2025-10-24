import React from 'react';
import { IconButton } from '../IconButton';
import styles from './FeedbackTextArea.module.scss';

export interface FeedbackTextAreaProps {
  /**
   * Current value of the textarea
   */
  value: string;
  
  /**
   * Handler for textarea value changes
   */
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  
  /**
   * Maximum character limit
   */
  maxCharacters: number;
  
  /**
   * Text content for labels and messages
   */
  texts: {
    promptTitle: string;
    promptOptional: string;
    disclaimer: string;
    characterCount: string;
    characterRemaining: string;
    contactInfo: string;
    departmentLinkText: string;
    submitButton?: string;
  };
  
  /**
   * Optional callback URL for the "Assessing department" link
   */
  assessingDeptUrl?: string;
  
  /**
   * Optional submit button text (if not provided, no button is rendered)
   */
  submitButton?: React.ReactNode;
  
  /**
   * Number of rows for the textarea
   */
  rows?: number;
  
  /**
   * Optional additional CSS class name
   */
  className?: string;
}

/**
 * Shared FeedbackTextArea component used in both FeedbackSender and ComplexFeedbackSender
 */
export const FeedbackTextArea: React.FC<FeedbackTextAreaProps> = ({
  value,
  onChange,
  maxCharacters,
  texts,
  assessingDeptUrl = '#',
  submitButton,
  rows = 6,
  className
}) => {
  const remainingChars = maxCharacters - value.length;

  return (
    <div className={className}>
      <legend className={`usa-legend usa-legend ${styles.feedbackPrompt}`}>
        <strong>{texts.promptTitle}</strong> <span className={styles.optionalText}>{texts.promptOptional}</span>
      </legend>
      
      <div className={`usa-hint ${styles.disclaimerText}`} id="feedback-hint">
        <em>{texts.disclaimer}</em>
      </div>
      
      <textarea
        className="usa-textarea"
        id="feedback-textarea"
        name="feedback-text"
        aria-describedby="feedback-hint character-count"
        value={value}
        onChange={onChange}
        rows={rows}
        data-validate-maxlength={`.{0,${maxCharacters}}`}
        maxLength={maxCharacters}
        placeholder="Share your feedback here..."
      />
      
      <div className="usa-hint" id="character-count" data-validator="maxlength">
        {value.length > 0 
          ? texts.characterRemaining.replace('{count}', remainingChars.toString())
          : texts.characterCount.replace('{count}', maxCharacters.toString())
        }
      </div>
      
      {submitButton}
      
      <p className={styles.contactInfo}>
        {texts.contactInfo} <a className="usa-link" href={assessingDeptUrl}>
          {texts.departmentLinkText}
        </a>.
      </p>
    </div>
  );
};

export default FeedbackTextArea;
