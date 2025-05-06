import React from 'react';
import styles from './Sidebar.module.scss';

export interface NavItem {
  label: string;
  url: string;
  isActive?: boolean;
}

interface SidebarProps {
  title: string;
  navItems: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  title,
  navItems
}) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <img 
          src="/src/assets/assessing_logo.svg" 
          alt="" 
          className={styles.logo}
        />
        <h2 className={styles.title}>{title}</h2>
      </div>

      <nav className={styles.sidebarNav} aria-label="Side navigation">
        <ul className="usa-sidenav">
          {navItems.map((item, index) => (
            <li key={index} className="usa-sidenav__item">
              <a 
                href={item.url} 
                className={item.isActive ? "usa-current" : ""}
              >
                <h3 className={styles.navItemHeader}>{item.label}</h3>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.contactSection}>
        <h2 className={styles.contactTitle}>CONTACT US</h2>
        <a href="#" className={styles.contactLink}>
          <img 
            src="/src/assets/assessing_icon_blue.svg" 
            alt="" 
            className={styles.contactIcon}
          />
          <h3 className={styles.navItemHeader}>Assessing Department</h3>
        </a>
        <a href="#" className={styles.contactLink}>
          <img 
            src="/src/assets/referral_icon.svg" 
            alt="" 
            className={styles.contactIcon}
          />
          <h3 className={styles.navItemHeader}>Tax Payer Referral</h3>
        </a>
      </div>
    </div>
  );
};

export default Sidebar; 