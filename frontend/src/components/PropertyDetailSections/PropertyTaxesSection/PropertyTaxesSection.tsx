/**
 * PropertyTaxesSection component displays property tax information and history
 */
export default function PropertyTaxesSection() {
  return (
    <section>
      <header>
        <h2>Property Taxes</h2>
      </header>
      
      <details open>
        <summary>Current Tax Year (FY 2024)</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Total Tax Bill:</strong> $9,427.20</p>
          <p><strong>Tax Rate:</strong> $12.00 per $1,000</p>
          <p><strong>Quarterly Payment:</strong> $2,356.80</p>
          <p><strong>Status:</strong> Current</p>
          <p><strong>Due Dates:</strong> Aug 1, Nov 1, Feb 1, May 1</p>
        </div>
      </details>

      <details>
        <summary>Tax Breakdown</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>City Tax:</strong> $7,541.76 (80%)</p>
          <p><strong>State Tax:</strong> $942.72 (10%)</p>
          <p><strong>County Tax:</strong> $942.72 (10%)</p>
          <p><strong>Special Assessments:</strong> $0.00</p>
          <p><strong>Total:</strong> $9,427.20</p>
        </div>
      </details>

      <details>
        <summary>Payment History</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Q1 FY 2024:</strong> $2,356.80 - Paid on July 28, 2023</p>
          <p><strong>Q4 FY 2023:</strong> $2,230.45 - Paid on May 15, 2023</p>
          <p><strong>Q3 FY 2023:</strong> $2,230.45 - Paid on January 30, 2023</p>
          <p><strong>Q2 FY 2023:</strong> $2,230.45 - Paid on October 25, 2022</p>
          <p><strong>Q1 FY 2023:</strong> $2,230.45 - Paid on July 29, 2022</p>
        </div>
      </details>

      <details>
        <summary>Exemptions & Credits</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Residential Exemption:</strong> $3,716.40 savings</p>
          <p><strong>Senior Citizen Exemption:</strong> Not applicable</p>
          <p><strong>Veteran Exemption:</strong> Not applicable</p>
          <p><strong>Disability Exemption:</strong> Not applicable</p>
          <p><strong>Total Exemptions:</strong> $3,716.40</p>
        </div>
      </details>
    </section>
  );
} 