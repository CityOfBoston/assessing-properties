/**
 * AbatementsSection component displays property tax abatements and incentives
 */
import PropertyDetailsSection from '../PropertyDetailsSection';
import { getAbatementPhase } from '@src/utils/periods';

interface AbatementsSectionProps {
  date?: Date;
}

export default function AbatementsSection({ date }: AbatementsSectionProps) {
  const now = date || new Date();
  const abatementYear = now.getFullYear();
  const abatementPhase = getAbatementPhase(now, abatementYear);
  return (
    <PropertyDetailsSection title="Abatements" date={date}>
      <div style={{ lineHeight: '28px', letterSpacing: '0.24px' }}>
        An abatement is a reduction in the assessed value of a property. An abatement is granted where the property is determined to be over-assessed, improperly classified or disproportionately assessed. For more information please visit{' '}
        <a
          className="usa-link usa-link--external"
          rel="noreferrer"
          target="_blank"
          href="https://www.boston.gov/departments/assessing/tax-exemptions-and-abatements"
        >
          Tax exemptions and abatements
        </a>
        .
        <p style={{ fontWeight: 'bold'}}>
          {abatementPhase.message}
        </p>
      </div>

      <div>
        {(abatementPhase.phase === 'open' || abatementPhase.phase === 'grace') && (
          <a
            className="usa-link usa-link--external"
            rel="noreferrer"
            target="_blank"
            href=""
          >
            Download Property Tax Abatements Application (PDF)
          </a>
        )}
      </div>
    </PropertyDetailsSection>
  );
} 