import React, { useState } from 'react';
import styles from './Tooltip.module.scss';

interface TooltipProps {
  hint: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  hint
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

  return (
    <div 
      className={styles.tooltip}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
          src={isActive 
            ? "/node_modules/cob-uswds/dist/img/usa-icons/help_outline.svg" 
            : "/node_modules/cob-uswds/dist/img/usa-icons/help.svg"
          } 
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