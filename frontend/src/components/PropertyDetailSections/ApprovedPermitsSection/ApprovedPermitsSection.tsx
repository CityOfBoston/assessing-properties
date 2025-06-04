/**
 * ApprovedPermitsSection component displays building permits and approvals
 */
export default function ApprovedPermitsSection() {
  return (
    <section>
      <header>
        <h2>Building Permits & Approvals</h2>
      </header>
      
      <details open>
        <summary>Recent Permits (2023-2024)</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Permit #2024-0156:</strong> Kitchen Renovation</p>
          <p style={{ marginLeft: '20px' }}>
            <strong>Issued:</strong> March 15, 2024 | <strong>Status:</strong> Completed<br/>
            <strong>Value:</strong> $45,000 | <strong>Contractor:</strong> Boston Home Remodeling LLC
          </p>
          
          <p><strong>Permit #2023-2847:</strong> Bathroom Addition</p>
          <p style={{ marginLeft: '20px' }}>
            <strong>Issued:</strong> September 8, 2023 | <strong>Status:</strong> Completed<br/>
            <strong>Value:</strong> $28,500 | <strong>Contractor:</strong> Elite Construction Co.
          </p>
          
          <p><strong>Permit #2023-1932:</strong> Solar Panel Installation</p>
          <p style={{ marginLeft: '20px' }}>
            <strong>Issued:</strong> June 22, 2023 | <strong>Status:</strong> Completed<br/>
            <strong>Value:</strong> $32,000 | <strong>Contractor:</strong> SolarTech Boston
          </p>
        </div>
      </details>

      <details>
        <summary>Historical Permits (2020-2022)</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Permit #2022-3421:</strong> HVAC System Replacement</p>
          <p style={{ marginLeft: '20px' }}>
            <strong>Issued:</strong> November 3, 2022 | <strong>Status:</strong> Completed<br/>
            <strong>Value:</strong> $18,750 | <strong>Contractor:</strong> Northeast Heating & Cooling
          </p>
          
          <p><strong>Permit #2021-1456:</strong> Roof Replacement</p>
          <p style={{ marginLeft: '20px' }}>
            <strong>Issued:</strong> May 12, 2021 | <strong>Status:</strong> Completed<br/>
            <strong>Value:</strong> $22,400 | <strong>Contractor:</strong> Boston Roofing Professionals
          </p>
          
          <p><strong>Permit #2020-0789:</strong> Window Replacement</p>
          <p style={{ marginLeft: '20px' }}>
            <strong>Issued:</strong> August 18, 2020 | <strong>Status:</strong> Completed<br/>
            <strong>Value:</strong> $16,200 | <strong>Contractor:</strong> Premium Windows Inc.
          </p>
        </div>
      </details>

      <details>
        <summary>Zoning & Compliance</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Zoning District:</strong> R-6 Residential</p>
          <p><strong>Building Code Compliance:</strong> Current</p>
          <p><strong>Fire Safety Inspection:</strong> Passed (Last: January 2024)</p>
          <p><strong>Occupancy Certificate:</strong> Valid</p>
          <p><strong>Special Conditions:</strong> Historic District Guidelines Apply</p>
          <p><strong>Violations:</strong> None on record</p>
        </div>
      </details>

      <details>
        <summary>Pending Applications</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Current Applications:</strong> None</p>
          <p><strong>Pre-Application Consultations:</strong> None scheduled</p>
          <p><strong>Permit Renewal Required:</strong> None</p>
          <p><strong>Next Inspection Due:</strong> Fire Safety (January 2025)</p>
        </div>
      </details>
    </section>
  );
} 