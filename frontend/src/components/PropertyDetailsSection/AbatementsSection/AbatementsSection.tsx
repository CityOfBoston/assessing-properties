/**
 * AbatementsSection component displays property tax abatements and incentives
 */
import PropertyDetailsSection from '../PropertyDetailsSection';
import ReactMarkdown from 'react-markdown';
import styles from '../PropertyDetailsSection.module.scss';
import { useAbatementsContent } from '@src/hooks/usePropertyDetailsContent';

interface AbatementsSectionProps {
  parcelId: string;
  title: string;
}

export default function AbatementsSection({ parcelId, title }: AbatementsSectionProps) {
  const { abatementPhase } = useAbatementsContent(parcelId);
  
  // Only render the section if there's a message to show
  if (!abatementPhase.message) {
    return null;
  }

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