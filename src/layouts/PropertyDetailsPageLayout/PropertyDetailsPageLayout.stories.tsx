import PropertyDetailsPageLayout from './PropertyDetailsPageLayout';
import type { Meta, StoryObj } from '@storybook/react';

const meta = {
    title: 'Layouts/PropertyDetailsPageLayout',
    component: PropertyDetailsPageLayout,
    parameters: {
      layout: 'fullscreen',
    },
  } satisfies Meta<typeof PropertyDetailsPageLayout>;
  
  export default meta;
  type Story = StoryObj<typeof PropertyDetailsPageLayout>;

  // Sample navigation items for the sidebar
  const sampleNavItems = [
    {
      label: 'General Information',
      url: '#general-information',
      isActive: true,
    },
    {
      label: 'Value and Tax Information',
      url: '#value-tax-information',
    },
    {
      label: 'Abatements and Exemptions',
      url: '#abatements-exemptions',
    },
    {
      label: 'Property Attributes',
      url: '#property-attributes',
    },
    {
      label: 'Value History',
      url: '#value-history',
    }
  ];
  
  export const LongContent: Story = {
    args: {
      propertyAddress: "123 Main Street, Boston, MA 02108",
      sidebarTitle: "Assessing",
      navItems: sampleNavItems,
      children: (
        <div style={{ padding: '20px' }}>
          <h1>Property Overview</h1>
          <p>
            This property was last assessed in 2023 with a valuation of $1,250,000. Property taxes are due quarterly.
          </p>
          
          {/* Generate multiple sections to enable scrolling */}
          {Array(15).fill(null).map((_, index) => (
            <div key={index} style={{ padding: '30px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
              <h2>Section {index + 1}</h2>
              <p>
                This is a demo section to showcase the sticky behavior of this specialized layout.
                When scrolling down, the header, sidebar, and property sub-header all remain visible.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at ligula eget lorem efficitur
                facilisis. Vivamus eget massa a nisi ultrices vestibulum. Sed molestie felis ut ex ultrices, 
                in faucibus tortor lacinia.
              </p>
              <p>
                Curabitur euismod velit nec libero tincidunt, in maximus mauris tempus. Praesent sit amet
                vestibulum enim. Nullam a ligula vel justo posuere viverra vel at tellus. Vestibulum ante
                ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed quis finibus dolor.
              </p>
              {index % 2 === 0 && (
                <div style={{ background: '#f9f9f9', padding: '15px', borderRadius: '4px', marginTop: '20px' }}>
                  <h3>Additional Information</h3>
                  <p>
                    Nulla facilisi. Donec euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc, 
                    quis aliquam nunc nisl eget nunc. Donec euismod, nisl eget ultricies aliquam, nunc nisl aliquet nunc,
                    quis aliquam nunc nisl eget nunc.
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      ),
      onExport: () => alert("Export clicked"),
      onPayTaxes: () => alert("Pay Taxes clicked"),
    },
  };

  export const ShortContent: Story = {
    args: {
      propertyAddress: "456 Commonwealth Avenue, Boston, MA 02215",
      sidebarTitle: "Property Details",
      navItems: sampleNavItems,
      children: (
        <div style={{ padding: '20px' }}>
          <h1>Property Overview</h1>
          <p>
            This property was last assessed in 2023 with a valuation of $950,000. Property taxes are due quarterly.
          </p>
          {Array(2).fill(null).map((_, index) => (
            <div key={index} style={{ padding: '30px', borderBottom: '1px solid #ddd', marginBottom: '20px' }}>
              <h2>Section {index + 1}</h2>
              <p>
                This is a demo section to showcase the sticky behavior of this specialized layout.
                When scrolling down, the header, sidebar, and property sub-header all remain visible.
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at ligula eget lorem efficitur
                facilisis. Vivamus eget massa a nisi ultrices vestibulum. Sed molestie felis ut ex ultrices, 
                in faucibus tortor lacinia.
              </p>
            </div>
          ))}
        </div>
      ),
      onExport: () => alert("Export clicked"),
      onPayTaxes: () => alert("Pay Taxes clicked"),
    },
  }; 