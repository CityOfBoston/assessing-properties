import React from 'react';
import styles from './IconButton.module.scss';

export interface IconButtonProps {
  /**
   * Optional button ID for analytics tracking
   */
  id?: string;

  /**
   * Optional SVG icon to display
   */
  src?: string;
  
  /**
   * The text to display
   */
  text: string;
  
  /**
   * Optional click handler
   */
  onClick?: () => void;
  
  /**
   * Optional additional CSS class names
   */
  className?: string;

  /**
   * Optional button type
   */
  type?: 'button' | 'submit' | 'reset';

  /**
   * When true, uses Lora font with normal case and weight instead of Montserrat all caps bold
   */
  useLoraFont?: boolean;

  /**
   * Optional variant style
   */
  variant?: 'primary' | 'outline' | 'default';

  /**
   * Optional disabled state
   */
  disabled?: boolean;
}

/**
 * IconButton component that displays optional icon alongside text
 */
export const IconButton: React.FC<IconButtonProps> = ({
  id,
  src,
  text,
  onClick,
  className = '',
  type = 'button',
  useLoraFont = false,
  variant = 'outline',
  disabled = false
}) => {
  const getButtonClass = () => {
    let baseClass = 'usa-button';
    switch (variant) {
      case 'primary':
        return baseClass;
      case 'outline':
        // Only apply outline class if there's an icon
        return `${baseClass} usa-button--outline`;
      default:
        return baseClass;
    }
  };

  return (
    <button 
      id={id}
      className={`${getButtonClass()} ${styles.iconButton} ${src ? styles.hasIcon : ''} ${className}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {src && (
        <span className={styles.iconWrapper}>
          <img src={src} alt="" className={styles.iconContainer} aria-hidden="true" />
        </span>
      )}
      <span className={`${styles.text} ${useLoraFont ? styles.loraText : styles.montserratText}`}>
        {text}
      </span>
    </button>
  );
};

export default IconButton; 