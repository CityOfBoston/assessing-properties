import React, { useState } from 'react';
import styles from './Tooltip.module.scss';
import helpIcon from '../../assets/help.svg';
import helpOutlineIcon from '../../assets/help_outline.svg';
import helpWhiteIcon from '../../assets/help_white.svg';
import helpOutlineWhiteIcon from '../../assets/help_outline_white.svg';

interface TooltipProps {
  hint: string;
  variant?: 'default' | 'white';
}

export const Tooltip: React.FC<TooltipProps> = ({
  hint,
  variant = 'default'
}) => {
  const [isActive, setIsActive] = useState(false);

  const handleMouseEnter = () => setIsActive(true);
  const handleMouseLeave = () => setIsActive(false);
  
  const handleFocus = () => setIsActive(true);
  const handleBlur = () => setIsActive(false);
  
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
        >
          {hint}
        </div>
      )}
    </div>
  );
};

export default Tooltip; 