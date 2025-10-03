/**
 * AbatementsSection component displays property tax abatements and incentives
 */
import PropertyDetailsSection from '../PropertyDetailsSection';
import { getAbatementPhase } from '@src/utils/periods';
import { useDateContext } from '@src/hooks/useDateContext';
import { getAbatementMessage } from '@src/utils/periodsLanguage';
import ReactMarkdown from 'react-markdown';
import styles from '../PropertyDetailsSection.module.scss';

interface AbatementsSectionProps {
  parcelId: string;
  title: string;
}

export default function AbatementsSection({ parcelId, title }: AbatementsSectionProps) {
  const { date } = useDateContext();
  const now = date;
  const calendarYear = now.getFullYear();
  const nowMonth = now.getMonth();
  // For abatements, we need to use the calendar year when applications are due
  // For July 2025 (FY2026), abatements for FY2026 were due in February 2025 (calendar year 2025)
  const abatementYear = nowMonth >= 6 ? calendarYear : calendarYear - 1;
  const abatementPhase = getAbatementPhase(now, abatementYear, parcelId);
  // Only render the section if there's a message to show
  if (!abatementPhase.message) {
    return null;
  }

  const content = getComponentText('AbatementsSection');
  const pageContent = getComponentText('propertyDetails', 'pages.propertyDetails');

  return (
    <PropertyDetailsSection title={title}>
      <div className={styles.paragraph}>
        <ReactMarkdown
          components={{
            a: ({ node, ...props }) => (
              <a
                className="usa-link usa-link--external"
                rel="noreferrer"
                target="_blank"
                {...props}
              />
            ),
            ul: ({ node, ...props }) => (
              <ul style={{ marginLeft: '20px', marginTop: '10px', marginBottom: '10px' }} {...props} />
            ),
            li: ({ node, ...props }) => (
              <li style={{ marginBottom: '5px' }} {...props} />
            )
          }}
        >
          {abatementPhase.message}
        </ReactMarkdown>
      </div>
    </PropertyDetailsSection>
  );
} 