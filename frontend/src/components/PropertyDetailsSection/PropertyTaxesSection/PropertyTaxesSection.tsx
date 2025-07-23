/**
 * PropertyTaxesSection component displays property tax information and history
 */
import PropertyDetailsSection from '../PropertyDetailsSection';
import PropertyDetailsCardGroup from '../../PropertyDetailsCardGroup';
import FormulaAccordion from '../../FormulaAccordion';
import { IconButton } from '../../IconButton';
import styles from './PropertyTaxesSection.module.scss';
import { PropertyTaxesSectionData } from '@src/types';
import { getExemptionPhase, getFiscalYear } from '@src/utils/periods';
import MessageBox from '../../MessageBox';

interface PropertyTaxesSectionProps extends PropertyTaxesSectionData {
  date?: Date;
}

export default function PropertyTaxesSection(props: PropertyTaxesSectionProps) {
  const { date, ...sectionData } = props;
  const now = date || new Date();
  const fiscalYear = getFiscalYear(now);
  
  // Determine eligibility and granted count for each exemption
  const isResidentialEligible = !sectionData.residentialExemptionFlag;
  const isPersonalEligible = !sectionData.personalExemptionFlag;
  // Granted if amount > 0 (even if not eligible)
  const residentialGranted = sectionData.residentialExemptionAmount && sectionData.residentialExemptionAmount > 0;
  const personalGranted = sectionData.personalExemptionAmount && sectionData.personalExemptionAmount > 0;
  const residentialGrantedCount = residentialGranted ? 1 : 0;
  const personalGrantedCount = personalGranted ? 1 : 0;

  // Get exemption phase for residential
  const residentialExemptionPhase = getExemptionPhase(
    now,
    fiscalYear,
    { isEligible: isResidentialEligible, grantedCount: residentialGrantedCount, type: 'Residential' }
  );

  // Calculate residential exemption amount dynamically or use a default
  const residentialExemptionMaxAmount = sectionData.residentialExemptionAmount;

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

  // Determine which FY to display for values (previous FY during preliminary period)
  const nowMonth = now.getMonth();
  const isPrelimPeriod = nowMonth >= 6 && nowMonth < 12; // July (6) to December (11)
  const displayFY = isPrelimPeriod ? fiscalYear - 1 : fiscalYear;

  const drawerOptions = [
    {
      title: `FY${displayFY} Gross Tax`,
      value: sectionData.propertyGrossTax != null ? `$${sectionData.propertyGrossTax.toLocaleString()}` : 'N/A',
    },
    {
      title: 'Residential Exemptions',
      value: sectionData.residentialExemptionAmount != null ? `-$${sectionData.residentialExemptionAmount.toLocaleString()}` : 'N/A',
      message:
        (() => {
          if (residentialGranted) {
            return 'A Residential Exemption has been granted for this parcel.';
          } else if (!isResidentialEligible) {
            return `This type of parcel was not eligible for a residential exemption in FY${displayFY}.`;
          }
          const phase = residentialExemptionPhase.phase;
          if (phase === 'open') {
            return 'You may be eligible for a Residential Exemption. See below for application details.';
          } else if (phase === 'after_deadline' || phase === 'after_grace' || phase === 'reference_only') {
            return `This parcel was eligible but not granted a Residential Exemption in FY${displayFY}.`;
          } else {
            return `This parcel was eligible but not granted a Residential Exemption in FY${displayFY}.`;
          }
        })(),
      description: (
        <div className={styles.exemptionContent}>
          <div className={styles.text}>
            If you own and live in your property as a primary residence, you may qualify for the residential exemption. This fiscal year, the residential exemption will save qualified Boston homeowners up to ${residentialExemptionMaxAmount.toLocaleString()}. The exemption amount will be applied to your third-quarter tax bill issued in late December. If you didn’t get the credit on your bill and believe you should have, you can apply for a residential exemption.
          </div>
          <div className={styles.text} style={{ fontWeight: 'bold'}}>
            {residentialGranted
              ? 'A Residential Exemption has been granted for this parcel.'
              : residentialExemptionPhase.message}
          </div>
          <ul className={styles.list}>
            {residentialExemptionPhase.phase === 'open' && (
              <>
                <li>
                  <strong>Deadline for submission:</strong> Tuesday, April 1, {fiscalYear}
                </li>
                <li>
                  <a
                    className="usa-link usa-link--external"
                    rel="noreferrer"
                    target="_blank"
                    href={`https://www.boston.gov/assessing-online/form/resexempt/FY${fiscalYear}/${sectionData.parcelId}`}
                  >
                    Download Residential Exemptions Application (PDF)
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      ),
    },
    {
      title: 'Personal Exemptions',
      value: sectionData.personalExemptionAmount != null ? `-$${sectionData.personalExemptionAmount.toLocaleString()}` : 'N/A',
      message:
        (() => {
          if (personalGranted) {
            return 'A Personal Exemption has been granted for this parcel.';
          } else if (!isPersonalEligible) {
            return `This type of parcel was not eligible for a personal exemption in FY${displayFY}.`;
          }
          const phase = getExemptionPhase(now, fiscalYear, { isEligible: isPersonalEligible, grantedCount: personalGrantedCount, type: 'Personal' }).phase;
          if (phase === 'open') {
            return 'You may be eligible for a Personal Exemption. See below for application details.';
          } else if (phase === 'after_deadline' || phase === 'after_grace' || phase === 'reference_only') {
            return `This parcel was eligible but not granted a Personal Exemption in FY${displayFY}.`;
          } else {
            return `This parcel was eligible but not granted a Personal Exemption in FY${displayFY}.`;
          }
        })(),
      description: (
        <div className={styles.exemptionContent}>
          <div className={styles.text}>
            Through an exemption, the City releases you from paying part or all of your property taxes.
          </div>
          <div className={styles.text} style={{ fontWeight: 'bold' }}>
            {personalGranted
              ? 'A Personal Exemption has been granted for this parcel.'
              : getExemptionPhase(now, fiscalYear, { isEligible: isPersonalEligible, grantedCount: personalGrantedCount, type: 'Personal' }).message}
          </div>
          <ul className={styles.list}>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href="https://www.boston.gov/departments/assessing/blind-exemption-37a"
              >
                Blind exemption 37A
              </a>
            </li>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href="https://www.boston.gov/departments/assessing/elderly-exemption-41c"
              >
                Elderly exemption 41D
              </a>
            </li>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href="https://www.boston.gov/departments/assessing/veterans-exemption-22"
              >
                Veterans Exemption 22
              </a>
            </li>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href="https://www.boston.gov/departments/assessing/surviving-spouse-minor-child-deceased-parent-elderly-exemption-17d"
              >
                Surviving Spouse, Minor Child of Deceased Parent, Elderly Exemption 17D
              </a>
            </li>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href="https://www.boston.gov/departments/assessing/national-guard-exemption"
              >
                National Guard Exemption
              </a>
            </li>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href="https://www.boston.gov/departments/assessing/co-op-housing-exemption"
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
      value: sectionData.communityPreservationAmount != null ? `-$${sectionData.communityPreservationAmount.toLocaleString()}` : 'N/A',
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
      title: <div className={styles.netTax}>FY{displayFY} Net Tax</div>,
      value: <div className={styles.netTax}>{sectionData.propertyNetTax != null ? `$${sectionData.propertyNetTax.toLocaleString()}` : 'N/A'}</div>,
    },
  ];

  return (
    <PropertyDetailsSection title="Property Taxes" date={date}>
      <div className={styles.taxRateContainer}>
        <h3 className={styles.header}>FY{fiscalYear} Tax Rate</h3>
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

      </div>

      {/* Formal MessageBox about reference values */}
      <MessageBox>
        {(() => {
          const nowMonth = now.getMonth();
          const nowYear = now.getFullYear();
          if (nowMonth >= 6 && nowMonth < 12) { // July (6) to December (11)
            return (
              <>
                Property tax information for the <strong>upcoming FY{fiscalYear}</strong> will be available for abatements and exemptions on January 1, {fiscalYear}.<br />
                Currently, we are displaying values from the <strong>past FY{fiscalYear - 1}</strong> for reference purposes only.
              </>
            );
          } else if (nowMonth < 6) { // January (0) to June (5)
            return (
              <>
                Property tax information for the <strong>currently open FY{fiscalYear}</strong> is shown below.
              </>
            );
          } else { // fallback
            return (
              <>
                Property tax information for FY{fiscalYear} is shown below.
              </>
            );
          }
        })()}
      </MessageBox>

      <h3 className={styles.header}>Net Tax</h3>
      <div className={styles.text}>
        Through exemptions, the City releases you from paying part or all of your property taxes. There's also other legally required fees and benefits that will change the amount you pay for taxes. After all of these calculations, the 'Net taxes' include the' final amount you are required to pay.
      </div>

      <div className={styles.accordion}>
        <FormulaAccordion drawerOptions={drawerOptions} />
      </div>

      <div className={styles.buttonContainer}>
        <a
          href={`https://www.boston.gov/real-estate-taxes?input1=${sectionData.parcelId}`}
          target="_blank"
          rel="noreferrer"
          className={styles.payTaxesLink}
        >
          <IconButton 
            text="Pay Your Taxes"
            variant="primary"
          />
        </a>
        <span className={styles.printPayTaxesLink}>
          Pay your taxes via https://www.boston.gov/real-estate-taxes?input1={sectionData.parcelId}
        </span>
      </div>
    </PropertyDetailsSection>
  );
} 