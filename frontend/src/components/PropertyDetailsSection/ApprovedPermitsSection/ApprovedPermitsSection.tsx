/**
 * ApprovedPermitsSection component displays building permits and approvals
 */
import PropertyDetailsSection from '../PropertyDetailsSection';
import styles from '../PropertyDetailsSection.module.scss';
import { useApprovedPermitsContent } from '@src/hooks/usePropertyDetailsContent';

interface ApprovedPermitsSectionProps {
  parcelId: string;
  title: string;
}

export default function ApprovedPermitsSection({ parcelId, title }: ApprovedPermitsSectionProps) {
  const { content, getPermitsUrl } = useApprovedPermitsContent(parcelId);

  return (
    <PropertyDetailsSection title={title}>
      <div className={styles.paragraph}>
        <a
          className="usa-link usa-link--external"
          rel="noreferrer"
          target="_blank"
          href={getPermitsUrl(parcelId)}
        >
          {content.description?.text || 'View approved building permits'}
        </a>
      </div>
    </PropertyDetailsSection>
  );
} 