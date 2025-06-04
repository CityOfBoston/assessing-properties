/**
 * AttributesSection component displays property attributes and characteristics
 */
export default function AttributesSection() {
  return (
    <section>
      <header>
        <h2>Property Attributes</h2>
      </header>
      
      <details open>
        <summary>Building Characteristics</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Exterior Wall:</strong> Brick</p>
          <p><strong>Roof Type:</strong> Gable</p>
          <p><strong>Roof Material:</strong> Asphalt Shingle</p>
          <p><strong>Foundation:</strong> Stone</p>
          <p><strong>Windows:</strong> Double Hung</p>
          <p><strong>Heat Type:</strong> Hot Water</p>
          <p><strong>Fuel:</strong> Gas</p>
          <p><strong>AC Type:</strong> Central Air</p>
        </div>
      </details>

      <details>
        <summary>Interior Features</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Bedrooms:</strong> 4</p>
          <p><strong>Full Bathrooms:</strong> 3</p>
          <p><strong>Half Bathrooms:</strong> 1</p>
          <p><strong>Kitchen Style:</strong> Modern</p>
          <p><strong>Fireplace:</strong> Yes (2)</p>
          <p><strong>Hardwood Floors:</strong> Yes</p>
          <p><strong>Finished Basement:</strong> Yes</p>
        </div>
      </details>

      <details>
        <summary>Property Features</summary>
        <div style={{ marginLeft: '20px', marginTop: '10px' }}>
          <p><strong>Garage:</strong> 2-Car Attached</p>
          <p><strong>Parking Spaces:</strong> 3</p>
          <p><strong>Deck/Patio:</strong> Rear Deck</p>
          <p><strong>Garden:</strong> Front & Rear</p>
          <p><strong>Fence:</strong> Privacy Fence</p>
          <p><strong>Pool:</strong> None</p>
        </div>
      </details>
    </section>
  );
} 