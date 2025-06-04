/**
 * OverviewSection component displays property overview information
 */
export default function OverviewSection() {
  return (
    <section>
      <header>
        <h2>Property Overview</h2>
      </header>
      
      <details open>
        <summary>Basic Information</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Property Address:</strong> 123 Main Street, Boston, MA 02118</p>
          <p><strong>Parcel ID:</strong> 1234567890</p>
          <p><strong>Property Type:</strong> Residential - Single Family</p>
          <p><strong>Neighborhood:</strong> South End</p>
          <p><strong>Ward:</strong> 4</p>
          <p><strong>Precinct:</strong> 0401</p>
        </div>
      </details>

      <details>
        <summary>Property Description</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Year Built:</strong> 1875</p>
          <p><strong>Building Style:</strong> Victorian Brownstone</p>
          <p><strong>Stories:</strong> 3</p>
          <p><strong>Total Units:</strong> 1</p>
          <p><strong>Zoning:</strong> R-6 Residential</p>
        </div>
      </details>

      <details>
        <summary>Owner Information</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Owner Name:</strong> Smith, John & Jane</p>
          <p><strong>Mailing Address:</strong> 123 Main Street, Boston, MA 02118</p>
          <p><strong>Ownership Type:</strong> Fee Simple</p>
        </div>
      </details>
    </section>
  );
} 