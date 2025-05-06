import React from 'react';
import styles from './Header.module.scss';

interface HeaderProps {
  /**
   * Optional additional content to inject into the header
   */
  additionalContent?: React.ReactNode;
}

export default function Header({ additionalContent }: HeaderProps = {}) {
  return (
    <div className="cob-slim-header">
        <div className="cob-slim-header__content">
            <a href="https://www.boston.gov" className="cob-slim-header__logo-link">
                <img src="/node_modules/cob-uswds/dist/img/cob-boston-logo.svg" alt="City of Boston" className="cob-slim-header__logo" />
            </a>
            <span className="cob-slim-header__separator"></span>
            <p className="cob-slim-header__mayor-text">Mayor Michelle Wu</p>
            {additionalContent && (
              <div className={styles.additionalContent}>
                {additionalContent}
              </div>
            )}
        </div>
    </div>
  );
}