import React from 'react';
import styles from './IconButton.module.scss';

interface IconButtonProps {
  /**
   * The SVG icon to display
   */
  icon: React.ReactNode;
  
  /**
   * The text to display next to the icon
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
}

/**
 * IconButton component that displays an icon alongside text
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  text,
  onClick,
  className = '',
  type = 'button'
}) => {
  return (
    <button 
      className={`usa-button usa-button--outline ${styles.iconButton} ${className}`}
      type={type}
      onClick={onClick}
    >
      <span className={styles.iconContainer}>
        {icon}
      </span>
      <span className={styles.text}>{text}</span>
    </button>
  );
};

export default IconButton; 