/**
 * ApprovedPermitsSection component displays building permits and approvals
 */
import PropertyDetailsSection from '../PropertyDetailsSection';
import { useDateContext } from '@src/hooks/useDateContext';

interface ApprovedPermitsSectionProps {
  parcelId: string;
}

export default function ApprovedPermitsSection({ parcelId }: ApprovedPermitsSectionProps) {
  const { date } = useDateContext();
  return (
    <PropertyDetailsSection title="Approved Permits">
      <div style={{ lineHeight: '28px', letterSpacing: '0.24px' }}>
        Building permits help to establish compliance of construction work with the minimum standards of safety established by the State Building Code.
      </div>

      <div style={{ lineHeight: '28px', letterSpacing: '0.24px' }}>
      This dataset includes information about building permits issued by the City of Boston from 2009 to the present. Permits that are being processed or have been denied, deleted, voided or revoked are not included in the dataset.
      </div>

      <div>
        <a
          className="usa-link usa-link--external"
          rel="noreferrer"
          target="_blank"
          href={`https://data.boston.gov/dataset/approved-building-permits/resource/6ddcd912-32a0-43df-9908-63574f8c7e77?filters=parcel_id%3A${parcelId}`}
        >
          View approved building permits
        </a>
      </div>
    </PropertyDetailsSection>
  );
} 