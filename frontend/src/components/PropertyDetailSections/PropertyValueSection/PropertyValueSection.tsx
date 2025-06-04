/**
 * PropertyValueSection component displays property value and assessment information
 */
export default function PropertyValueSection() {
  return (
    <section>
      <header>
        <h2>Property Value & Assessment</h2>
      </header>
      
      <details open>
        <summary>Current Assessment (FY 2024)</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Total Assessed Value:</strong> $785,600</p>
          <p><strong>Land Value:</strong> $234,800</p>
          <p><strong>Building Value:</strong> $550,800</p>
          <p><strong>Assessment Date:</strong> January 1, 2024</p>
          <p><strong>Effective Date:</strong> July 1, 2024</p>
        </div>
      </details>

      <details>
        <summary>Previous Assessments</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>FY 2023:</strong> $742,300 (Total) | $220,700 (Land) | $521,600 (Building)</p>
          <p><strong>FY 2022:</strong> $698,900 (Total) | $209,500 (Land) | $489,400 (Building)</p>
          <p><strong>FY 2021:</strong> $675,200 (Total) | $202,800 (Land) | $472,400 (Building)</p>
          <p><strong>FY 2020:</strong> $651,800 (Total) | $195,600 (Land) | $456,200 (Building)</p>
        </div>
      </details>

      <details>
        <summary>Market Analysis</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Estimated Market Value:</strong> $825,000 - $875,000</p>
          <p><strong>Price per Square Foot:</strong> $412</p>
          <p><strong>Neighborhood Average:</strong> $745,300</p>
          <p><strong>Year-over-Year Change:</strong> +5.8%</p>
          <p><strong>Assessment Ratio:</strong> 95.3%</p>
        </div>
      </details>
    </section>
  );
} 