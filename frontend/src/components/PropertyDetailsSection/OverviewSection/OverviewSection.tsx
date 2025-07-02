import styles from './OverviewSection.module.scss';
import PropertyDetailsCardGroup from '@components/PropertyDetailsCardGroup';
import IconButton from '@components/IconButton';
import PropertyDetailsSection from '../PropertyDetailsSection';
import { OverviewSectionData } from '@src/types';

/**
 * Custom target icon component for property location
 */
const TargetIcon = () => (
  <svg 
    width="80" 
    height="80" 
    viewBox="0 0 80 80" 
    className={styles.targetIcon}
    style={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 2,
      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
    }}
  >
    {/* Large transparent blue hue circle */}
    <circle cx="40" cy="40" r="35" fill="#005ea2" opacity="0.4"/>
    
    {/* Outer white circle with black outline */}
    <circle cx="40" cy="40" r="12" fill="white" stroke="black" strokeWidth="1" opacity="0.9"/>
    
    {/* Blue core circle */}
    <circle cx="40" cy="40" r="8" fill="#005ea2" opacity="0.8"/>
    
    {/* Inner white center */}
    <circle cx="40" cy="40" r="3" fill="white" opacity="0.9"/>
  </svg>
);

/**
 * OverviewSection component displays property overview information
 */
export default function OverviewSection({ data }: { data: OverviewSectionData }) {
  const cards = [
    {
      icon: <img src="/cob-uswds/img/usa-icons/account_circle.svg"/>,
      header: 'Parcel ID',
      value: data.parcelId.toString()
    },
    {
      icon: <img src="/cob-uswds/img/usa-icons/attach_money.svg"/>,
      header: 'FY25 Net Tax',
      value: data.netTax != null ? `$${data.netTax.toLocaleString()}` : 'N/A'
    },
    { 
      icon: <img src="/cob-uswds/img/usa-icons/person.svg"/>,
      header: 'Personal Exemption',
      value: data.personalExemption ? 'Yes' : 'No'
    },
    {
      icon: <img src="/cob-uswds/img/usa-icons/home.svg"/>,
      header: 'Residential Exemption',
      value: data.residentialExemption ? 'Yes' : 'No'
    }
  ];

  return (
    <PropertyDetailsSection title="Overview">
      <section className={styles.section}>
        <div className={styles.leftContent}>
          <div className={styles.locationContainer}>
            <img src="/cob-uswds/img/usa-icons/location_on.svg" alt="Location" className={styles.locationIcon} />
            <span>{data.fullAddress}</span>
          </div>

          <div className={styles.divider} />

          <div className={styles.sectionHeader}>
            <img src="/cob-uswds/img/usa-icons/people.svg" alt="Owners" className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Current Owner(s)</h2>
          </div>
          <div className={styles.sectionContent}>
            {data.owners.map((owner, index) => (
              <p key={index}>{owner}</p>
            ))}
            <p className={styles.ownerDisclaimer}>
              Owner information may not reflect any changes submitted to City of Boston Assessing after October 25, 2024. Authoritative ownership information is held by the Registry of Deeds.
            </p>
          </div>

          <div className={styles.divider} />

          <div className={styles.sectionHeader}>
            <img src="/cob-uswds/img/usa-icons/trending_up.svg" alt="Value" className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Assessed Value</h2>
          </div>
          <div className={styles.sectionContent}>
            <p>{data.assessedValue != null ? `$${data.assessedValue.toLocaleString()}` : 'N/A'}</p>
          </div>

          <div className={styles.divider} />

          <div className={styles.sectionHeader}>
            <img src="/cob-uswds/img/usa-icons/location_city.svg" alt="Property Type" className={styles.sectionIcon} />
            <h2 className={styles.sectionTitle}>Property Type</h2>
          </div>
          <div className={styles.sectionContent}>
            <p>{data.propertyType}</p>
          </div>
        </div>

        <div className={styles.rightContent}>
          {data.imageSrc && (
            <div className={styles.imageContainer} style={{ position: 'relative' }}>
          <img 
            src={data.imageSrc} 
            alt="Property" 
            className={styles.propertyImage}
          />
              <TargetIcon />
            </div>
          )}
          <h2 className={styles.mapLink}><a
            className={`usa-link usa-link--external`}
            rel="noreferrer"
            target="_blank"
            href={`https://app01.cityofboston.gov/AssessingMap/?find=${data.parcelId}`}
          >Open in map</a>
          </h2>
        </div>
      </section>

      <div className={`${styles.cardGroupSection} ${styles.desktop}`}>
        <PropertyDetailsCardGroup cards={cards} maxCardsPerRow={4} />
      </div>

      <div className={`${styles.cardGroupSection} ${styles.mobile}`}>
        <PropertyDetailsCardGroup cards={cards} maxCardsPerRow={2} />
      </div>

      <div className={styles.buttonGroup}>
        <a
          href={`https://www.boston.gov/real-estate-taxes?input1=${data.parcelId}`}
          target="_blank"
          rel="noreferrer"
        >
          <IconButton 
            text="Pay Your Taxes"
            variant="primary"
          />
        </a>
        <IconButton src="/cob-uswds/img/usa-icons/print.svg" text="Print" />
      </div>
    </PropertyDetailsSection>
  );
} 