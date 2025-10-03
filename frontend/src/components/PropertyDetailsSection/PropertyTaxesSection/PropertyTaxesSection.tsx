/**
 * PropertyTaxesSection component displays property tax information and history
 */
import PropertyDetailsSection from '../PropertyDetailsSection';
import PropertyDetailsCardGroup from '../../PropertyDetailsCardGroup';
import FormulaAccordion from '../../FormulaAccordion';
import { IconButton } from '../../IconButton';
import styles from './PropertyTaxesSection.module.scss';
import sharedStyles from '../PropertyDetailsSection.module.scss';
import { PropertyTaxesSectionData } from '@src/types';
import { getExemptionPhase, getFiscalYear, formatDateForDisplay, EXEMPTION_APPLICATION_DEADLINE_DATE } from '@src/utils/periods';
import { getPersonalExemptionLink, getPersonalExemptionLabel, getLanguageString } from '@src/utils/periodsLanguage';
import MessageBox from '../../MessageBox';
import ReactMarkdown from 'react-markdown';
import { useDateContext } from '@src/hooks/useDateContext';

interface PropertyTaxesSectionProps extends PropertyTaxesSectionData {
  title: string;
}

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

  // For exemption phases, we need to use the calendar year for phase calculations
  const calendarYear = now.getFullYear();
  
  // Get exemption phase for residential
  const residentialExemptionPhase = getExemptionPhase(
    now,
    calendarYear,
    { grantedCount: residentialGrantedCount, type: 'Residential' }
  );

  // Get exemption phase for personal
  const personalExemptionPhase = getExemptionPhase(
    now,
    calendarYear,
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
          return getLanguageString('periods.property_taxes.to_be_decided');
        }
        return formatTaxValue(sectionData.residentialExemptionAmount) !== 'N/A' ? `- ${formatTaxValue(sectionData.residentialExemptionAmount)}` : 'N/A';
      })(),
      message:
        (() => {
          const phase = residentialExemptionPhase.phase;
          console.log('Accordion message debug:', {
            phase,
            residentialGranted,
            residentialExemptionApproved
          });

          if (phase === 'preliminary') {
            return <ReactMarkdown components={{
              strong: ({ node, ...props }) => (
                <span style={{ fontWeight: 'bold' }} {...props} />
              )
            }}>
              {residentialExemptionApproved 
                ? getLanguageString('periods.property_taxes.residential_preliminary_submitted', { current_fy: displayFY })
                : getLanguageString('periods.property_taxes.residential_preliminary_not_submitted', { current_fy: displayFY })
              }
            </ReactMarkdown>;
          } else if (phase === 'open') {
            return <ReactMarkdown components={{
              strong: ({ node, ...props }) => (
                <span style={{ fontWeight: 'bold' }} {...props} />
              )
            }}>
              {residentialGranted 
                ? getLanguageString('periods.property_taxes.residential_exemption_granted')
                : getLanguageString('periods.property_taxes.residential_exemption_not_granted', {
                    residential_exemption_url: getLanguageString('periods.property_taxes.residential_exemption_url', { 
                      current_fy: fiscalYear, 
                      parcel_id: sectionData.parcelId 
                    })
                  })
              }
            </ReactMarkdown>;
          } else if (phase === 'after_deadline' || phase === 'after_grace') {
            return <ReactMarkdown components={{
              strong: ({ node, ...props }) => (
                <span style={{ fontWeight: 'bold' }} {...props} />
              )
            }}>
              {getLanguageString('periods.property_taxes.residential_deadline_passed', {
                next_year: fiscalYear,
                deadline_date: formatDateForDisplay(EXEMPTION_APPLICATION_DEADLINE_DATE.getDate(calendarYear)),
                next_fy: fiscalYear + 1
              })}
            </ReactMarkdown>;
          } else {
            return <ReactMarkdown components={{
              strong: ({ node, ...props }) => (
                <span style={{ fontWeight: 'bold' }} {...props} />
              )
            }}>
              {getLanguageString('periods.property_taxes.residential_deadline_passed', {
                next_year: fiscalYear,
                deadline_date: formatDateForDisplay(EXEMPTION_APPLICATION_DEADLINE_DATE.getDate(calendarYear)),
                next_fy: fiscalYear + 1
              })}
            </ReactMarkdown>;
          }
        })(),
      description: (
        <div className={styles.exemptionContent}>
          <div className={sharedStyles.paragraph}>
            <ReactMarkdown components={{
              strong: ({ node, ...props }) => (
                <span style={{ fontWeight: 'bold' }} {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="usa-link usa-link--external"
                  rel="noreferrer"
                  target="_blank"
                  {...props}
                />
              )
            }}>
              {(() => {
                const phase = residentialExemptionPhase.phase;
                if (phase === 'preliminary') {
                  return getLanguageString('periods.property_taxes.residential_exemption_preliminary_description');
                } else if (phase === 'open') {
                  return getLanguageString('periods.property_taxes.residential_exemption_open_description', {
                    next_year: fiscalYear,
                    deadline_date: formatDateForDisplay(EXEMPTION_APPLICATION_DEADLINE_DATE.getDate(calendarYear))
                  });
                } else if (phase === 'after_deadline' || phase === 'after_grace') {
                  return getLanguageString('periods.property_taxes.residential_exemption_after_deadline_description');
                } else {
                  return getLanguageString('periods.property_taxes.residential_exemption_description', { 
                    max_amount: residentialExemptionMaxAmount.toLocaleString() 
                  });
                }
              })()}
            </ReactMarkdown>
          </div>
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
          return getLanguageString('periods.property_taxes.to_be_decided');
        }
        return formatTaxValue(sectionData.personalExemptionAmount) !== 'N/A' ? `- ${formatTaxValue(sectionData.personalExemptionAmount)}` : 'N/A';
      })(),
      message:
        (() => {
          const phase = personalExemptionPhase.phase;
          if (phase === 'preliminary') {
            return <ReactMarkdown components={{
              strong: ({ node, ...props }) => (
                <span style={{ fontWeight: 'bold' }} {...props} />
              )
            }}>
              {personalExemptionApproved 
                ? getLanguageString('periods.property_taxes.personal_preliminary_submitted', { current_fy: displayFY })
                : getLanguageString('periods.property_taxes.personal_preliminary_not_submitted', { current_fy: displayFY })
              }
            </ReactMarkdown>;
          } else if (phase === 'open') {
            return <ReactMarkdown components={{
              strong: ({ node, ...props }) => (
                <span style={{ fontWeight: 'bold' }} {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="usa-link usa-link--external"
                  rel="noreferrer"
                  target="_blank"
                  {...props}
                />
              )
            }}>
              {personalGranted 
                ? getLanguageString('periods.property_taxes.personal_exemption_granted')
                : getLanguageString('periods.property_taxes.personal_exemption_not_granted', {
                    next_year: fiscalYear,
                    deadline_date: formatDateForDisplay(EXEMPTION_APPLICATION_DEADLINE_DATE.getDate(calendarYear)),
                    personal_exemption_url: "https://www.boston.gov/assessing-online/form/persexempt/FY" + fiscalYear + "/" + sectionData.parcelId
                  })
              }
            </ReactMarkdown>;
          } else if (phase === 'after_deadline' || phase === 'after_grace') {
            return <ReactMarkdown components={{
              strong: ({ node, ...props }) => (
                <span style={{ fontWeight: 'bold' }} {...props} />
              )
            }}>
              {getLanguageString('periods.property_taxes.personal_deadline_passed', {
                next_year: fiscalYear,
                deadline_date: formatDateForDisplay(EXEMPTION_APPLICATION_DEADLINE_DATE.getDate(calendarYear)),
                next_fy: fiscalYear + 1
              })}
            </ReactMarkdown>;
          } else {
            return <ReactMarkdown components={{
              strong: ({ node, ...props }) => (
                <span style={{ fontWeight: 'bold' }} {...props} />
              )
            }}>
              {getLanguageString('periods.property_taxes.personal_deadline_passed', {
                next_year: fiscalYear,
                deadline_date: formatDateForDisplay(EXEMPTION_APPLICATION_DEADLINE_DATE.getDate(calendarYear)),
                next_fy: fiscalYear + 1
              })}
            </ReactMarkdown>;
          }
        })(),
      description: (
        <div className={styles.exemptionContent}>
          <div className={sharedStyles.paragraph}>
            <ReactMarkdown components={{
              strong: ({ node, ...props }) => (
                <span style={{ fontWeight: 'bold' }} {...props} />
              ),
              a: ({ node, ...props }) => (
                <a
                  className="usa-link usa-link--external"
                  rel="noreferrer"
                  target="_blank"
                  {...props}
                />
              )
            }}>
              {personalExemptionPhase.phase === 'preliminary'
                ? getLanguageString('periods.property_taxes.personal_exemption_preliminary_description')
                : getLanguageString('periods.property_taxes.personal_exemption_description')
              }
            </ReactMarkdown>
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
        <div className={sharedStyles.paragraph}>
          The Community Preservation surcharge supports a variety of programs. To learn more, visit the{' '}
          <a
            className="usa-link usa-link--external"
            rel="noreferrer"
            target="_blank"
            href="https://www.boston.gov/departments/assessing/community-preservation-act"
          >
            Community Preservation Act
          </a>{' '}
          page.
        </div>
      ),
    },
    {
      title: <div className={styles.netTax}>{isPrelimPeriod ? `FY${displayFY} Estimated Total, First Half (Q1 + Q2)` : `FY${displayFY} Net Tax`}</div>,
      value: <div className={styles.netTax}>{formatTaxValue(isPrelimPeriod ? sectionData.totalBilledAmount : sectionData.propertyNetTax)}</div>,
    },
  ];


  return (
    <PropertyDetailsSection title={props.title}>
      {!isPrelimPeriod && (
        <>
          <div className={styles.taxRateContainer}>
            <h3 className={styles.header}>{getLanguageString('periods.property_taxes.tax_rate_header', { current_fy: displayFY })}</h3>
            <div className={sharedStyles.paragraph}>
              {getLanguageString('periods.property_taxes.tax_rate_description')}{' '}
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                href={getLanguageString('periods.property_taxes.how_we_tax_url')}
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
                href={getLanguageString('periods.property_taxes.tax_rate_history_url')}
              >
                {getLanguageString('periods.property_taxes.view_tax_rate_history')}
              </a>
            </div>
          </div>

          {/* Formal MessageBox about reference values */}
          <MessageBox>
            {(() => {
              const phase = residentialExemptionPhase.phase;
              console.log('MessageBox phase debug:', {
                date: now.toISOString(),
                phase,
                calendarYear,
                fiscalYear,
                residentialGranted
              });
              
              // Three distinct periods:
              // 1. Open period (Jan 1 to April deadline) - Show granted/not granted message
              // 2. After deadline until preliminary (April deadline to July 1) - Show deadline passed message
              // 3. Preliminary period (July 1 to Dec 31) - Show regular message
              
              if (phase === 'open') {
                return (
                  <ReactMarkdown components={{
                    strong: ({ node, ...props }) => (
                      <span style={{ fontWeight: 'bold' }} {...props} />
                    )
                  }}>
                    {residentialGranted 
                      ? getLanguageString('periods.property_taxes.residential_exemption_granted')
                      : getLanguageString('periods.property_taxes.residential_exemption_not_granted', {
                          residential_exemption_url: getLanguageString('periods.property_taxes.residential_exemption_url', { 
                            current_fy: fiscalYear, 
                            parcel_id: sectionData.parcelId 
                          })
                        })
                    }
                  </ReactMarkdown>
                );
              }
              
              if (phase === 'after_deadline' || phase === 'after_grace') {
                return (
                  <ReactMarkdown components={{
                    strong: ({ node, ...props }) => (
                      <span style={{ fontWeight: 'bold' }} {...props} />
                    )
                  }}>
                    {getLanguageString('periods.property_taxes.residential_deadline_passed', {
                      next_year: fiscalYear,
                      deadline_date: formatDateForDisplay(EXEMPTION_APPLICATION_DEADLINE_DATE.getDate(calendarYear)),
                      next_fy: fiscalYear + 1
                    })}
                  </ReactMarkdown>
                );
              }
              
              if (phase === 'preliminary') {
                return (
                  <ReactMarkdown components={{
                    strong: ({ node, ...props }) => (
                      <span style={{ fontWeight: 'bold' }} {...props} />
                    )
                  }}>
                    {getLanguageString('periods.MessageBox_messages.regular_message', {
                      current_fy: fiscalYear,
                      next_fy: fiscalYear + 1
                    })}
                  </ReactMarkdown>
                );
              }
              
              // Default to regular message
              return (
                <ReactMarkdown components={{
                  strong: ({ node, ...props }) => (
                    <span style={{ fontWeight: 'bold' }} {...props} />
                  )
                }}>
                  {getLanguageString('periods.MessageBox_messages.regular_message', {
                    current_fy: fiscalYear,
                    next_fy: fiscalYear + 1
                  })}
                </ReactMarkdown>
              );
            })()}
          </MessageBox>
        </>
      )}

      <h3 className={styles.header}>
        {isPrelimPeriod 
          ? getLanguageString('periods.property_taxes.net_tax_preliminary_header', { 
              current_fy: displayFY, 
              prev_year: displayFY - 1 
            })
          : getLanguageString('periods.property_taxes.net_tax_header')
        }
      </h3>
      <div className={sharedStyles.paragraph}>
         <ReactMarkdown>
           {isPrelimPeriod 
             ? getLanguageString('periods.property_taxes.net_tax_preliminary_description', { 
                 current_fy: displayFY,
                 prev_year: displayFY - 1,
                 current_year: displayFY
               })
             : getLanguageString('periods.property_taxes.net_tax_description')
           }
         </ReactMarkdown>
      </div>

      <div className={styles.accordion}>
        <FormulaAccordion drawerOptions={drawerOptions} />
      </div>

      <div className={styles.buttonContainer}>
        <a
          href={getLanguageString('periods.buttons.pay_taxes_url', { parcel_id: sectionData.parcelId })}
          target="_blank"
          rel="noreferrer"
          className={styles.payTaxesLink}
        >
          <IconButton 
            text={getLanguageString('periods.buttons.pay_your_taxes')}
            variant="primary"
          />
        </a>
        <span className={styles.printPayTaxesLink}>
          Pay your taxes via {getLanguageString('periods.buttons.pay_taxes_url', { parcel_id: sectionData.parcelId })}
        </span>
      </div>
    </PropertyDetailsSection>
  );
} 