/**
 * AbatementsSection component displays property tax abatements and incentives
 */
import PropertyDetailsSection from '../PropertyDetailsSection';

export default function AbatementsSection() {
  return (
    <PropertyDetailsSection title="Abatements">
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
      </div>

      <div>
        <strong>Deadline for submission</strong>: Monday, February 3, 2025 at 5:00:00 PM.
      </div>

      <div>
        <a
          className="usa-link usa-link--external"
          rel="noreferrer"
          target="_blank"
          href=""
        >
          Download Property Tax Abatements Application (PDF)
        </a>
      </div>
    </PropertyDetailsSection>
  );
} 