import styles from './OverviewSection.module.scss';
import PropertyDetailsCardGroup from '@components/PropertyDetailsCardGroup';
import IconButton from '@components/IconButton';
import PropertyDetailsSection from '../PropertyDetailsSection';

interface OverviewSectionData {
  fullAddress: string;
  owners: string[];
  imageSrc: string;
  assessedValue: number;
  propertyType: string;
  parcelId: number;
  netTax: number;
  personalExample: boolean;
  residentialExemption: boolean;
}

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
      value: `$${data.netTax.toLocaleString()}`
    },
    { 
      icon: <img src="/cob-uswds/img/usa-icons/person.svg"/>,
      header: 'Personal Exemption',
      value: data.personalExample ? 'Yes' : 'No'
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
            <h1 className={styles.sectionTitle}>Current Owner(s)</h1>
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
            <h1 className={styles.sectionTitle}>Assessed Value</h1>
          </div>
          <div className={styles.sectionContent}>
            <p>${data.assessedValue.toLocaleString()}</p>
          </div>

          <div className={styles.divider} />

          <div className={styles.sectionHeader}>
            <img src="/cob-uswds/img/usa-icons/location_city.svg" alt="Property Type" className={styles.sectionIcon} />
            <h1 className={styles.sectionTitle}>Property Type</h1>
          </div>
          <div className={styles.sectionContent}>
            <p>{data.propertyType}</p>
          </div>
        </div>

        <div className={styles.rightContent}>
          <img 
            src={data.imageSrc} 
            alt="Property" 
            className={styles.propertyImage}
          />
          <h1 className={styles.mapLink}><a
            className={`usa-link usa-link--external`}
            rel="noreferrer"
            target="_blank"
            href={`https://app01.cityofboston.gov/AssessingMap/?find=${data.parcelId}`}
          >Open in map</a>
          </h1>
        </div>
      </section>

      <div className={`${styles.cardGroupSection} ${styles.desktop}`}>
        <PropertyDetailsCardGroup cards={cards} maxCardsPerRow={4} />
      </div>

      <div className={`${styles.cardGroupSection} ${styles.mobile}`}>
        <PropertyDetailsCardGroup cards={cards} maxCardsPerRow={2} />
      </div>

      <div className={styles.buttonGroup}>
        <button className={`usa-button usa-button--primary`}>Pay your taxes</button>
        <IconButton src="/cob-uswds/img/usa-icons/print.svg" text="Print" />
      </div>
    </PropertyDetailsSection>
  );
} 