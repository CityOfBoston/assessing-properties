/**
 * AbatementsSection component displays property tax abatements and incentives
 */
import PropertyDetailsSection from '../PropertyDetailsSection';
import { getAbatementPhase } from '@src/utils/periods';
import { useDateContext } from '@src/hooks/useDateContext';
import { getAbatementMessage } from '@src/utils/periodsLanguage';

interface AbatementsSectionProps {}

export default function AbatementsSection({}: AbatementsSectionProps) {
  const { date } = useDateContext();
  const now = date;
  const calendarYear = now.getFullYear();
  const nowMonth = now.getMonth();
  // For abatements, we need to use the calendar year when applications are due
  // For July 2025 (FY2026), abatements for FY2026 were due in February 2025 (calendar year 2025)
  const abatementYear = nowMonth >= 6 ? calendarYear : calendarYear - 1;
  const abatementPhase = getAbatementPhase(now, abatementYear);
  return (
    <PropertyDetailsSection title="Abatements">
      <div style={{ lineHeight: '28px', letterSpacing: '0.24px' }}>
        {getAbatementMessage('description')}{' '}
        <a
          className="usa-link usa-link--external"
          rel="noreferrer"
          target="_blank"
          href={getAbatementMessage('tax_exemptions_url')}
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
            {getAbatementMessage('download_application')}
          </a>
        )}
      </div>
    </PropertyDetailsSection>
  );
} 