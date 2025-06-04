/**
 * AbatementsSection component displays property tax abatements and incentives
 */
export default function AbatementsSection() {
  return (
    <section>
      <header>
        <h2>Tax Abatements & Incentives</h2>
      </header>
      
      <details open>
        <summary>Active Abatements</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Historic Preservation Abatement:</strong> $1,250.00 annually</p>
          <p><strong>Start Date:</strong> July 1, 2019</p>
          <p><strong>End Date:</strong> June 30, 2029</p>
          <p><strong>Percentage:</strong> 15% of improvement value</p>
          <p><strong>Remaining Years:</strong> 5</p>
        </div>
      </details>

      <details>
        <summary>Energy Efficiency Credits</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Solar Panel Installation:</strong> $850.00 annually</p>
          <p><strong>Energy Star Windows:</strong> $425.00 annually</p>
          <p><strong>High-Efficiency HVAC:</strong> $675.00 annually</p>
          <p><strong>Total Energy Credits:</strong> $1,950.00</p>
          <p><strong>Valid Through:</strong> December 31, 2025</p>
        </div>
      </details>

      <details>
        <summary>Available Programs</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Residential Rehabilitation:</strong> Up to 20% abatement for qualifying improvements</p>
          <p><strong>Green Building:</strong> 10-15% abatement for LEED certified renovations</p>
          <p><strong>Affordable Housing:</strong> Up to 100% abatement for income-qualified properties</p>
          <p><strong>Senior Citizen Deferral:</strong> Tax payment deferral for qualifying seniors</p>
          <p><strong>Veteran Exemption:</strong> $400 annual exemption for qualified veterans</p>
        </div>
      </details>

      <details>
        <summary>Application Status</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Pending Applications:</strong> None</p>
          <p><strong>Recently Approved:</strong> Energy Efficiency Credits (Approved: March 2023)</p>
          <p><strong>Application Deadlines:</strong></p>
          <ul style={{ marginLeft: '20px', marginTop: '5px' }}>
            <li>Residential Exemption: February 1st annually</li>
            <li>Energy Credits: Rolling basis</li>
            <li>Historic Preservation: 60 days after completion</li>
          </ul>
        </div>
      </details>
    </section>
  );
} 