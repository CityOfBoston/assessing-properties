/**
 * PropertyTaxesSection component displays property tax information and history
 */
import PropertyDetailsSection from '../PropertyDetailsSection';
import PropertyDetailsCardGroup from '@components/PropertyDetailsCardGroup';
import FormulaAccordion from '@components/FormulaAccordion';
import styles from './PropertyTaxesSection.module.scss';
import { PropertyTaxesSectionData } from '@src/types';

export default function PropertyTaxesSection({
  propertyGrossTax,
  residentialExemption,
  personalExemption,
  communityPreservation,
  propertyNetTax,
  parcelId
}: PropertyTaxesSectionData) {
  const taxRateCards = [
    {
      header: 'Residential Tax Rate',
      value: '$11.58 per $1,000',
    },
    {
      header: 'Commercial Tax Rate',
      value: '$25.96 per $1,000',
    },
  ];

  const drawerOptions = [
    {
      title: 'FY25 Gross Tax',
      value: `$${propertyGrossTax.toLocaleString()}`,
    },
    {
      title: 'Residential Exemptions',
      value: `-$${residentialExemption.toLocaleString()}`,
      message: residentialExemption === 0
        ? 'This type of parcel is not eligible for a residential exemption'
        : 'A residential Exemption has been granted for this parcel',
      description: (
        <div className={styles.exemptionContent}>
          <div className={styles.text}>
            If you own and live in your property as a primary residence, you may qualify for the residential exemption. This fiscal year, the residential exemption will save qualified Boston homeowners up to $3,984.21 on their tax bill. We apply the exemption amount to your third-quarter tax bill that is issued in late December. If you didn't get the credit on your bill and think you should have, you can apply for a residential exemption.
          </div>
          <ul className={styles.list}>
            <li>
              <strong>Deadline for submission:</strong> Tuesday, April 1, 2025
            </li>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href=""
              >
                Download Residential Exemptions Application (PDF)
              </a>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Personal Exemptions',
      value: `-$${personalExemption.toLocaleString()}`,
      message: personalExemption === 0
        ? 'This type of parcel is not eligible for a personal exemption'
        : 'A personal Exemption has been granted for this parcel',
      description: (
        <div className={styles.exemptionContent}>
          <div className={styles.text}>
            Through an exemption, the City releases you from paying part or all of your property taxes.
          </div>
          <ul className={styles.list}>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href=""
              >
                Blind exemption 37A
              </a>
            </li>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href=""
              >
                Elderly exemption 41D
              </a>
            </li>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href=""
              >
                Veterans Exemption 22
              </a>
            </li>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href=""
              >
                Surviving Spouse, Minor Child of Deceased Parent, Elderly Exemption 17D
              </a>
            </li>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href=""
              >
                National Guard Exemption
              </a>
            </li>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href=""
              >
                Co-op Housing Exemption
              </a>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Community Preservation',
      value: `-$${communityPreservation.toLocaleString()}`,
      description: (
        <div className={styles.text}>
          We calculate the CPA surcharge by first deducting $100,000 from the value of your property. Next, we recalculate the tax and apply your residential exemption and any personal exemptions, if you have them. To learn more visit the{' '}
          <a
            className="usa-link usa-link--external"
            rel="noreferrer"
            target="_blank"
            href="https://www.boston.gov/departments/assessing/community-preservation-act"
          >
            Community Preservation Act
          </a>
        </div>
      ),
    },
    {
      title: <div className={styles.netTax}>FY25 Net Tax</div>,
      value: <div className={styles.netTax}>${propertyNetTax.toLocaleString()}</div>,
    },
  ];

  return (
    <PropertyDetailsSection title="Property Taxes">
      <h2 className={styles.header}>FY25 Tax Rate</h2>
      <div className={styles.text}>
        For more information on the breakdown of the tax calculation, visit{' '}
        <a
          className="usa-link usa-link--external"
          rel="noreferrer"
          target="_blank"
          href="https://www.boston.gov/departments/assessing/how-we-tax-your-property"
        >
          How we tax your property
        </a>
        .
      </div>

      <div className={styles.cardGroup}>
        <PropertyDetailsCardGroup cards={taxRateCards} />
      </div>

      <div className={styles.link}>
        <a
          className="usa-link usa-link--external"
          rel="noreferrer"
          target="_blank"
          href="https://www.boston.gov/sites/default/files/file/2024/01/FY24%20Tax%20Rate%20History_1.pdf"
        >
          View tax rate history (PDF)
        </a>
      </div>

      <h2 className={styles.header}>Net Tax</h2>
      <div className={styles.text}>
        Through exemptions, the City releases you from paying part or all of your property taxes. There's also other legally required fees and benefits that will change the amount you pay for taxes. After all of these calculations, the 'Net taxes' include the' final amount you are required to pay.
      </div>

      <div className={styles.accordion}>
        <FormulaAccordion drawerOptions={drawerOptions} />
      </div>

      <div className={styles.buttonContainer}>
        <a
          href={`https://www.boston.gov/real-estate-taxes?input1=${parcelId}`}
          target="_blank"
          rel="noreferrer"
        >
          <button className="usa-button" type="button">
            Pay Your Taxes
          </button>
        </a>
      </div>
    </PropertyDetailsSection>
  );
} 