/**
 * ApprovedPermitsSection component displays building permits and approvals
 */
import PropertyDetailsSection from '../PropertyDetailsSection';
import { useDateContext } from '@src/hooks/useDateContext';
import { getComponentText } from '@utils/contentMapper';
import styles from '../PropertyDetailsSection.module.scss';

interface ApprovedPermitsSectionProps {
  parcelId: string;
  title: string;
}

export default function ApprovedPermitsSection({ parcelId, title }: ApprovedPermitsSectionProps) {
  const { date } = useDateContext();
  const content = getComponentText('ApprovedPermitsSection');
  const pageContent = getComponentText('propertyDetails', 'pages.propertyDetails');

  return (
    <PropertyDetailsSection title={title}>
      <div className={styles.paragraph}>
        <a
          className="usa-link usa-link--external"
          rel="noreferrer"
          target="_blank"
          href={content.description.url.replace('{parcelId}', parcelId)}
        >
          {content.description.text}
        </a>
      </div>
    </PropertyDetailsSection>
  );
} 