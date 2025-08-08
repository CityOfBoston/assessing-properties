/**
 * PropertyTaxesSection component displays property tax information and history
 */
import PropertyDetailsSection from '../PropertyDetailsSection';
import PropertyDetailsCardGroup from '../../PropertyDetailsCardGroup';
import FormulaAccordion from '../../FormulaAccordion';
import { IconButton } from '../../IconButton';
import styles from './PropertyTaxesSection.module.scss';
import { PropertyTaxesSectionData } from '@src/types';
import { getExemptionPhase, getFiscalYear, formatDateForDisplay, EXEMPTION_APPLICATION_DEADLINE_DATE } from '@src/utils/periods';
import { getPropertyTaxMessage, getPersonalExemptionLink, getPersonalExemptionLabel } from '@src/utils/periodsLanguage';
import MessageBox from '../../MessageBox';
import { useDateContext } from '@src/hooks/useDateContext';

interface PropertyTaxesSectionProps extends PropertyTaxesSectionData {}

export default function PropertyTaxesSection(props: PropertyTaxesSectionProps) {
  const { date } = useDateContext();
  const sectionData = props;
  const now = date;
  const fiscalYear = getFiscalYear(now);
  
  // Determine if we're in the preliminary period (July-December)
  const nowMonth = now.getMonth();
  const isPrelimPeriod = nowMonth >= 6 && nowMonth < 12; // July (6) to December (11)
  // After July 1st, we're in the new fiscal year for tax rates
  const displayFY = fiscalYear;
  
  // In preliminary period, exemption flags show approval status from previous year
  // Outside preliminary period, exemption flags don't indicate eligibility
  const residentialExemptionApproved = sectionData.residentialExemptionFlag;
  const personalExemptionApproved = sectionData.personalExemptionFlag;
  
  // Granted if amount > 0
  const residentialGranted = sectionData.residentialExemptionAmount && sectionData.residentialExemptionAmount > 0;
  const personalGranted = sectionData.personalExemptionAmount && sectionData.personalExemptionAmount > 0;
  const residentialGrantedCount = residentialGranted ? 1 : 0;
  const personalGrantedCount = personalGranted ? 1 : 0;

  // For exemption phases, we need to use the calendar year when applications are due
  // For July 2025 (FY2026), exemptions for FY2026 were due in April 2025 (calendar year 2025)
  const calendarYear = now.getFullYear();
  const exemptionYear = nowMonth >= 6 ? calendarYear : calendarYear - 1;
  
  // Get exemption phase for residential
  const residentialExemptionPhase = getExemptionPhase(
    now,
    exemptionYear,
    { grantedCount: residentialGrantedCount, type: 'Residential' }
  );

  // Get exemption phase for personal
  const personalExemptionPhase = getExemptionPhase(
    now,
    exemptionYear,
    { grantedCount: personalGrantedCount, type: 'Personal' }
  );

  // Calculate residential exemption amount dynamically or use a default
  const residentialExemptionMaxAmount = sectionData.residentialExemptionAmount;

  const taxRateCards = [
    {
      header: 'Residential Tax Rate',
      value: '$11.58 per $1,000',
      isGrey: true,
    },
    {
      header: 'Commercial Tax Rate',
      value: '$25.96 per $1,000',
      isGrey: true,
    },
  ];

  // Helper to format values: show 'N/A' if not parsable to integer or is 0
  function formatTaxValue(val: any) {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed) || parsed === 0) return 'N/A';
    if (typeof val === 'number') return `$${val.toLocaleString()}`;
    if (typeof val === 'string' && /^\$?\d/.test(val)) return val;
    return 'N/A';
  }

  const drawerOptions = [
    {
      title: isPrelimPeriod ? `FY${displayFY} Estimated Tax (Q1 + Q2)` : `FY${displayFY} Gross Tax`,
      value: formatTaxValue(isPrelimPeriod ? sectionData.estimatedTotalFirstHalf : sectionData.propertyGrossTax),
    },
    {
      title: 'Residential Exemptions',
      value: (() => {
        if (residentialGranted) {
          return isPrelimPeriod ? 'Amount to be decided' : `- ${formatTaxValue(sectionData.residentialExemptionAmount)}`;
        }
        if (isPrelimPeriod && residentialExemptionApproved) {
          return getPropertyTaxMessage('to_be_decided');
        }
        return formatTaxValue(sectionData.residentialExemptionAmount) !== 'N/A' ? `- ${formatTaxValue(sectionData.residentialExemptionAmount)}` : 'N/A';
      })(),
      message:
        (() => {
          if (residentialGranted) {
            return getPropertyTaxMessage('residential_exemption_granted');
          }
          const phase = residentialExemptionPhase.phase;
          if (phase === 'open') {
            return getPropertyTaxMessage('residential_open_phase');
          } else if (phase === 'preliminary') {
            return residentialExemptionApproved 
              ? getPropertyTaxMessage('residential_preliminary_submitted', { current_fy: displayFY })
              : getPropertyTaxMessage('residential_preliminary_not_submitted', { current_fy: displayFY });
          } else if (phase === 'after_deadline' || phase === 'after_grace') {
            return getPropertyTaxMessage('residential_deadline_passed', {
              next_year: fiscalYear,
              deadline_date: formatDateForDisplay(EXEMPTION_APPLICATION_DEADLINE_DATE.getDate(exemptionYear)),
              next_fy: fiscalYear + 1
            });
          } else {
            return getPropertyTaxMessage('residential_deadline_passed', {
              next_year: fiscalYear,
              deadline_date: formatDateForDisplay(EXEMPTION_APPLICATION_DEADLINE_DATE.getDate(exemptionYear)),
              next_fy: fiscalYear + 1
            });
          }
        })(),
      description: (
        <div className={styles.exemptionContent}>
          <div className={styles.text}>
            {getPropertyTaxMessage('residential_exemption_description', { max_amount: residentialExemptionMaxAmount.toLocaleString() })}
          </div>
          <div className={styles.text} style={{ fontWeight: 'bold'}}>
            {residentialGranted
              ? getPropertyTaxMessage('residential_exemption_granted')
              : residentialExemptionPhase.message}
          </div>
          <ul className={styles.list}>
            {residentialExemptionPhase.phase === 'open' && (
              <>
                <li>
                  <strong>{getPropertyTaxMessage('deadline_for_submission')}</strong> Tuesday, April 1, {exemptionYear + 1}
                </li>
                <li>
                  <a
                    className="usa-link usa-link--external"
                    rel="noreferrer"
                    target="_blank"
                    href={getPropertyTaxMessage('residential_exemption_url', { current_fy: fiscalYear, parcel_id: sectionData.parcelId })}
                  >
                    {getPropertyTaxMessage('download_residential_exemption')}
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
      value: (() => {
        if (personalGranted) {
          return isPrelimPeriod ? 'Amount to be decided' : `- ${formatTaxValue(sectionData.personalExemptionAmount)}`;
        }
        if (isPrelimPeriod && personalExemptionApproved) {
          return getPropertyTaxMessage('to_be_decided');
        }
        return formatTaxValue(sectionData.personalExemptionAmount) !== 'N/A' ? `- ${formatTaxValue(sectionData.personalExemptionAmount)}` : 'N/A';
      })(),
      message:
        (() => {
          if (personalGranted) {
            return getPropertyTaxMessage('personal_exemption_granted');
          }
          const phase = personalExemptionPhase.phase;
          if (phase === 'open') {
            return getPropertyTaxMessage('personal_open_phase');
          } else if (phase === 'preliminary') {
            return personalExemptionApproved 
              ? getPropertyTaxMessage('personal_preliminary_submitted', { current_fy: displayFY })
              : getPropertyTaxMessage('personal_preliminary_not_submitted', { current_fy: displayFY });
          } else if (phase === 'after_deadline' || phase === 'after_grace') {
            return getPropertyTaxMessage('personal_deadline_passed', {
              next_year: fiscalYear,
              deadline_date: formatDateForDisplay(EXEMPTION_APPLICATION_DEADLINE_DATE.getDate(exemptionYear)),
              next_fy: fiscalYear + 1
            });
          } else {
            return getPropertyTaxMessage('personal_deadline_passed', {
              next_year: fiscalYear,
              deadline_date: formatDateForDisplay(EXEMPTION_APPLICATION_DEADLINE_DATE.getDate(exemptionYear)),
              next_fy: fiscalYear + 1
            });
          }
        })(),
      description: (
        <div className={styles.exemptionContent}>
          <div className={styles.text}>
            {getPropertyTaxMessage('personal_exemption_description')}
                  </div>
          <div className={styles.text} style={{ fontWeight: 'bold' }}>
            {personalGranted
              ? getPropertyTaxMessage('personal_exemption_granted')
              : personalExemptionPhase.message}
              </div>
          <ul className={styles.list}>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href={getPersonalExemptionLink('blind_exemption')}
              >
                {getPersonalExemptionLabel('blind_exemption')}
              </a>
            </li>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href={getPersonalExemptionLink('elderly_exemption')}
              >
                {getPersonalExemptionLabel('elderly_exemption')}
              </a>
            </li>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href={getPersonalExemptionLink('veterans_exemption')}
              >
                {getPersonalExemptionLabel('veterans_exemption')}
              </a>
            </li>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href={getPersonalExemptionLink('surviving_spouse_exemption')}
              >
                {getPersonalExemptionLabel('surviving_spouse_exemption')}
              </a>
            </li>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href={getPersonalExemptionLink('national_guard_exemption')}
              >
                {getPersonalExemptionLabel('national_guard_exemption')}
              </a>
            </li>
            <li>
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href={getPersonalExemptionLink('coop_housing_exemption')}
              >
                {getPersonalExemptionLabel('coop_housing_exemption')}
              </a>
            </li>
          </ul>
        </div>
      ),
    },
    {
      title: 'Community Preservation',
      value: formatTaxValue(sectionData.communityPreservationAmount) !== 'N/A' ? `+ ${formatTaxValue(sectionData.communityPreservationAmount)}` : '-',
      description: (
        <div className={styles.text}>
          {getPropertyTaxMessage('community_preservation_description')}{' '}
          <a
            className="usa-link usa-link--external"
            rel="noreferrer"
            target="_blank"
            href={getPropertyTaxMessage('community_preservation_url')}
          >
            Community Preservation Act
          </a>
        </div>
      ),
    },
    {
      title: <div className={styles.netTax}>{isPrelimPeriod ? `FY${displayFY} Estimated Total, First Half (Q1 + Q2)` : `FY${displayFY} Net Tax`}</div>,
      value: <div className={styles.netTax}>{formatTaxValue(isPrelimPeriod ? sectionData.totalBilledAmount : sectionData.propertyNetTax)}</div>,
    },
  ];

  return (
    <PropertyDetailsSection title="Property Taxes">
      <div className={styles.taxRateContainer}>
        <h3 className={styles.header}>{getPropertyTaxMessage('tax_rate_header', { current_fy: displayFY })}</h3>
        <div className={styles.text}>
          {getPropertyTaxMessage('tax_rate_description')}{' '}
          <a
            className="usa-link usa-link--external"
            rel="noreferrer"
            target="_blank"
            href={getPropertyTaxMessage('how_we_tax_url')}
          >
            How we tax your property
          </a>
          .
          </div>

        <div className={styles.cardGroup}>
          <PropertyDetailsCardGroup cards={taxRateCards}/>
        </div>
      <div className={styles.link}>
        <a
          className="usa-link usa-link--external"
          rel="noreferrer"
          target="_blank"
          href={getPropertyTaxMessage('tax_rate_history_url')}
        >
          {getPropertyTaxMessage('view_tax_rate_history')}
        </a>
      </div>

      </div>

      {/* Formal MessageBox about reference values */}
      <MessageBox>
        {(() => {
          const nowMonth = now.getMonth();
          if (nowMonth >= 6 && nowMonth < 12) { // July (6) to December (11)
            return (
              <>
                {getPropertyTaxMessage('prelim_period_message', { 
                  current_fy: fiscalYear, 
                  prev_fy: fiscalYear - 1, 
                  next_fy: fiscalYear + 1, 
                  next_year: calendarYear + 1 
                })}<br />
                Applications for FY{fiscalYear + 1} will become available on January 1, {calendarYear + 1}.
              </>
            );
          } else if (nowMonth < 6) { // January (0) to June (5)
            return (
              <>
                {getPropertyTaxMessage('regular_period_message', { 
                  current_fy: fiscalYear, 
                  next_fy: fiscalYear + 1, 
                  next_year: calendarYear + 1 
                })}
              </>
            );
          } else { // fallback
            return (
              <>
                {getPropertyTaxMessage('fallback_message', { current_fy: fiscalYear })}
              </>
            );
          }
        })()}
      </MessageBox>

      <h3 className={styles.header}>
        {isPrelimPeriod 
          ? getPropertyTaxMessage('net_tax_preliminary_header', { 
              current_fy: displayFY, 
              prev_year: displayFY - 1 
            })
          : getPropertyTaxMessage('net_tax_header')
        }
      </h3>
      <div className={styles.text}>
        {isPrelimPeriod 
          ? getPropertyTaxMessage('net_tax_preliminary_description', { 
              next_year: displayFY + 1 
            })
          : getPropertyTaxMessage('net_tax_description')
        }
      </div>

      <div className={styles.accordion}>
        <FormulaAccordion drawerOptions={drawerOptions} />
      </div>

      <div className={styles.buttonContainer}>
        <a
          href={getPropertyTaxMessage('pay_taxes_url', { parcel_id: sectionData.parcelId })}
          target="_blank"
          rel="noreferrer"
          className={styles.payTaxesLink}
        >
          <IconButton 
            text={getPropertyTaxMessage('pay_your_taxes')}
            variant="primary"
          />
        </a>
        <span className={styles.printPayTaxesLink}>
          Pay your taxes via {getPropertyTaxMessage('pay_taxes_url', { parcel_id: sectionData.parcelId })}
        </span>
      </div>
    </PropertyDetailsSection>
  );
} 