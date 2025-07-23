/**
 * ContactUsSection component displays contact information and support resources
 */
import React from 'react';
import PropertyDetailsSection from '../PropertyDetailsSection';
import styles from './ContactUsSection.module.scss';
import assessingLogo from '@assets/assessing_logo.svg';

interface ContactBoxProps {
  iconSrc: string;
  children: React.ReactNode;
}

const ContactBox: React.FC<ContactBoxProps> = ({ iconSrc, children }) => {
  return (
    <div className={styles.contactBox}>
      <img src={iconSrc} alt="Contact" className={styles.icon}/>
      {children}
    </div>
  );
};

interface ContactUsSectionProps {
  date?: Date;
}

export default function ContactUsSection({ date }: ContactUsSectionProps) {
  return (
    <PropertyDetailsSection title="Contact Us" date={date}>
      <div className={styles.container}>
        <ContactBox iconSrc={assessingLogo}>
          <ul className={styles.list}>
            <li>
              Email our staff at{' '}
              <a href="mailto:TRACFAXSG@boston.gov">TRACFAXSG@boston.gov</a>
            </li>
            <li>
              For current fiscal year tax bill Questions, contact the{' '}
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href="https://www.boston.gov/departments/assessing"
              >
                Taxpayer Referral & Assistance Center
              </a>
            </li>
            <li>
              Visit{' '}
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href="https://www.boston.gov/departments/assessing"
              >
                The Assessing Department
              </a>{' '}
              for more information
            </li>
          </ul>
        </ContactBox>

        <ContactBox iconSrc="/cob-uswds/img/usa-icons/phone.svg">
          <ul className={styles.list}>
            <li>
              For prior fiscal year tax payments, interest charges, fees, etc. contact the Collector's office at{' '}
              <a href="tel:617-635-4131">617-635-4131</a>
            </li>
            <li>
              Main Number:{' '}
              <a href="tel:617-635-4321">617-635-4321</a>
            </li>
            <li>
              Personal Property:{' '}
              <a href="tel:617-635-1165">617-635-1165</a>
            </li>
            <li>
              Tax Data Administration:{' '}
              <a href="tel:617-635-3783">617-635-3783</a>
            </li>
          </ul>
        </ContactBox>
      </div>
    </PropertyDetailsSection>
  );
} 