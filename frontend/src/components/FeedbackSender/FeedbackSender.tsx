import React, { useState } from 'react';
import { IconButton } from '../IconButton';
import styles from './FeedbackSender.module.scss';

export interface FeedbackSenderProps {
  /**
   * Optional handler for the feedback submission
   */
  onSubmit?: (data: { helpful: boolean; feedback?: string; parcelId?: string }) => void;
  
  /**
   * Optional callback URL for the "Assessing department" link
   */
  assessingDeptUrl?: string;

  /**
   * Optional parcelId for context
   */
  parcelId?: string;

  /**
   * Text content
   */
  texts?: {
    question?: string;
    yesLabel?: string;
    noLabel?: string;
    promptTitle?: string;
    promptOptional?: string;
    disclaimer?: string;
    submitButton?: string;
    characterCount?: string;
    characterRemaining?: string;
    contactInfo?: string;
    departmentLinkText?: string;
  };
}

/**
 * FeedbackSender component allows users to provide feedback on the page content
 */
export const FeedbackSender: React.FC<FeedbackSenderProps> = ({
  onSubmit,
  assessingDeptUrl = '#',
  parcelId,
  texts
}) => {
  const [feedbackOption, setFeedbackOption] = useState<string | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const MAX_CHARACTERS = 200;
  const remainingChars = MAX_CHARACTERS - feedbackText.length;

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFeedbackOption(event.target.value);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value;
    if (newText.length <= MAX_CHARACTERS) {
      setFeedbackText(newText);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    
    if (onSubmit && feedbackOption) {
      onSubmit({
        helpful: feedbackOption === 'yes',
        feedback: feedbackText || undefined,
        parcelId,
      });
    }
    
    // Reset form
    setFeedbackOption(null);
    setFeedbackText('');
  };

  return (
    <form className={styles.feedbackForm} onSubmit={handleSubmit}>
      <div className={styles.feedbackContainer}>
        <p className={styles.feedbackQuestion} id="feedback-question">{texts.question}</p>
        
        <div className={styles.radioGroup} role="radiogroup" aria-labelledby="feedback-question">
          <div className="usa-radio">
            <input
              className="usa-radio__input usa-radio__input--tile"
              id="feedback-yes"
              type="radio"
              name="page-helpful"
              value="yes"
              checked={feedbackOption === 'yes'}
              onChange={handleOptionChange}
            />
            <label className="usa-radio__label" htmlFor="feedback-yes">
              {texts.yesLabel}
            </label>
          </div>
          
          <div className="usa-radio">
            <input
              className="usa-radio__input usa-radio__input--tile"
              id="feedback-no"
              type="radio"
              name="page-helpful"
              value="no"
              checked={feedbackOption === 'no'}
              onChange={handleOptionChange}
            />
            <label className="usa-radio__label" htmlFor="feedback-no">
              {texts.noLabel}
            </label>
          </div>
        </div>
      </div>
      
      {feedbackOption && (
        <div className={styles.feedbackContainer}>
          <legend className={`usa-legend usa-legend ${styles.feedbackPrompt}`}>
            <strong>{texts.promptTitle}</strong> {texts.promptOptional}
          </legend>
          
          <div className={`usa-hint ${styles.disclaimerText}`} id="feedback-hint">
            <em>{texts.disclaimer}</em>
          </div>
          
          <textarea
            className="usa-textarea"
            id="feedback-textarea"
            name="feedback-text"
            aria-describedby="feedback-hint character-count"
            value={feedbackText}
            onChange={handleTextChange}
            rows={6}
            data-validate-maxlength={`.{0,${MAX_CHARACTERS}}`}
            maxLength={MAX_CHARACTERS}
          />
          
          <div className="usa-hint" id="character-count" data-validator="maxlength">
            {feedbackText.length > 0 
              ? texts.characterRemaining.replace('{count}', remainingChars.toString())
              : texts.characterCount.replace('{count}', MAX_CHARACTERS.toString())
            }
          </div>
          
          <IconButton 
            text={texts.submitButton}
            variant="primary"
            type="submit"
          />
          
          <p className={styles.contactInfo}>
            {texts.contactInfo}{' '}
            <a className="usa-link" href={assessingDeptUrl}>
              {texts.departmentLinkText}
            </a>.
          </p>
        </div>
      )}
    </form>
  );
};

export default FeedbackSender; 