/**
 * @deprecated This component is no longer used in the application.
 * Previously used in AnnotatedSearchBar but has been replaced with inline helper text.
 * Retained for reference only - do not use in new code.
 */
import React, { useState, useRef, useEffect } from 'react';
import styles from './Tooltip.module.scss';
import helpIcon from '../../assets/help.svg';
import helpOutlineIcon from '../../assets/help_outline.svg';
import helpWhiteIcon from '../../assets/help_white.svg';
import helpOutlineWhiteIcon from '../../assets/help_outline_white.svg';

/**
 * @deprecated This component is no longer used in the application.
 * Previously used in AnnotatedSearchBar but has been replaced with inline helper text.
 * Retained for reference only - do not use in new code.
 */
interface TooltipProps {
  hint: string;
  variant?: 'default' | 'white';
}

/**
 * @deprecated This component is no longer used in the application.
 * Previously used in AnnotatedSearchBar but has been replaced with inline helper text.
 * Retained for reference only - do not use in new code.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  hint,
  variant = 'default'
}) => {
  const [isActive, setIsActive] = useState(false);
  const [iconRect, setIconRect] = useState<DOMRect | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleMouseEnter = () => {
    updateIconPosition();
    setIsActive(true);
  };
  const handleMouseLeave = () => setIsActive(false);
  
  const handleFocus = () => {
    updateIconPosition();
    setIsActive(true);
  };
  const handleBlur = () => setIsActive(false);
  
  const updateIconPosition = () => {
    if (buttonRef.current) {
      setIconRect(buttonRef.current.getBoundingClientRect());
    }
  };
  
  useEffect(() => {
    if (isActive) {
      updateIconPosition();
      // Update position on scroll or resize
      window.addEventListener('scroll', updateIconPosition);
      window.addEventListener('resize', updateIconPosition);
      return () => {
        window.removeEventListener('scroll', updateIconPosition);
        window.removeEventListener('resize', updateIconPosition);
      };
    }
  }, [isActive]);
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Toggle tooltip when Enter or Space is pressed
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsActive(!isActive);
    }
  };

  const getIconSrc = () => {
    if (variant === 'white') {
      return isActive ? helpOutlineWhiteIcon : helpWhiteIcon;
    }
    return isActive ? helpOutlineIcon : helpIcon;
  };

  return (
    <div 
      className={styles.tooltip}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      data-variant={variant}
    >
      <button
        ref={buttonRef}
        id="tooltip_help_button"
        className={styles.iconButton}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        aria-label="Help information"
        aria-expanded={isActive}
        tabIndex={0}
      >
        <img 
          src={getIconSrc()}
          alt=""
          className={styles.icon}
          aria-hidden="true"
        />
      </button>
      {isActive && (
        <div 
          className={styles.tooltipContent}
          role="tooltip"
          id="tooltip-content"
          style={iconRect ? {
            '--icon-top': `${iconRect.top}px`,
            '--icon-left': `${iconRect.left}px`,
            '--icon-width': `${iconRect.width}px`,
          } as React.CSSProperties : undefined}
        >
          {hint}
        </div>
      )}
    </div>
  );
};

export default Tooltip; 