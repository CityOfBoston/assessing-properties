/**
 * ContactUsSection component displays contact information and support resources
 */
export default function ContactUsSection() {
  return (
    <section>
      <header>
        <h2>Contact Information & Support</h2>
      </header>
      
      <details open>
        <summary>Assessing Department</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Address:</strong> City Hall, Room 809, 1 City Hall Square, Boston, MA 02201</p>
          <p><strong>Phone:</strong> (617) 635-4287</p>
          <p><strong>Email:</strong> assessing@boston.gov</p>
          <p><strong>Hours:</strong> Monday - Friday, 9:00 AM - 5:00 PM</p>
          <p><strong>Website:</strong> www.boston.gov/departments/assessing</p>
        </div>
      </details>

      <details>
        <summary>Property Tax Department</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Address:</strong> City Hall, Room 825, 1 City Hall Square, Boston, MA 02201</p>
          <p><strong>Phone:</strong> (617) 635-4266</p>
          <p><strong>Email:</strong> treasury@boston.gov</p>
          <p><strong>Online Payments:</strong> www.boston.gov/pay-property-taxes</p>
          <p><strong>Payment Hours:</strong> Monday - Friday, 8:30 AM - 4:30 PM</p>
        </div>
      </details>

      <details>
        <summary>Building & Permits</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Address:</strong> 1010 Massachusetts Avenue, Boston, MA 02118</p>
          <p><strong>Phone:</strong> (617) 635-5166</p>
          <p><strong>Email:</strong> isd@boston.gov</p>
          <p><strong>Permit Portal:</strong> www.boston.gov/building-permits</p>
          <p><strong>Hours:</strong> Monday - Friday, 8:00 AM - 4:00 PM</p>
        </div>
      </details>

      <details>
        <summary>Appeals & Disputes</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Appellate Tax Board:</strong> (617) 727-3100</p>
          <p><strong>Board of Appeal:</strong> (617) 635-3850</p>
          <p><strong>Assessment Appeals:</strong> File by February 1st annually</p>
          <p><strong>Forms & Information:</strong> www.boston.gov/property-tax-appeals</p>
          <p><strong>Legal Aid:</strong> Greater Boston Legal Services - (617) 371-1234</p>
        </div>
      </details>

      <details>
        <summary>Online Resources</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Property Search:</strong> www.boston.gov/property-assessment</p>
          <p><strong>Tax Payment Portal:</strong> www.boston.gov/pay-taxes</p>
          <p><strong>Exemption Applications:</strong> www.boston.gov/tax-exemptions</p>
          <p><strong>Building Permits:</strong> www.boston.gov/building-permits</p>
          <p><strong>Zoning Information:</strong> www.boston.gov/zoning</p>
          <p><strong>311 Services:</strong> www.boston.gov/311 or call 311</p>
        </div>
      </details>
    </section>
  );
} 