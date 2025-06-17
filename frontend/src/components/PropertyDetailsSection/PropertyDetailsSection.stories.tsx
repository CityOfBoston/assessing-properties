import type { Meta, StoryObj } from '@storybook/react';
import {
  OverviewSection,
  AttributesSection,
  PropertyValueSection,
  PropertyTaxesSection,
  AbatementsSection,
  ApprovedPermitsSection,
  ContactUsSection,
} from './index';

const meta: Meta = {
  title: 'Components/PropertyDetailsSection',
  component: OverviewSection,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Base story that will be used for all variants
const BaseStory: Story = {
  render: () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ marginBottom: '40px', textAlign: 'center' }}>Property Details</h1>
      <div id="section-container" />
    </div>
  ),
};

// Create variants for each section
export const Overview: Story = {
  ...BaseStory,
  render: () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <OverviewSection 
        data={{
          fullAddress: "123 Main Street, Boston, MA 02118",
          owners: ["John Smith", "Jane Smith"],
          imageSrc: "https://placehold.co/512x512",
          assessedValue: 750000,
          propertyType: "Residential - Single Family",
          parcelId: 1234567890,
          netTax: 7500,
          personalExample: false,
          residentialExemption: true
        }}
      />
    </div>
  ),
};

export const Attributes: Story = {
  ...BaseStory,
  render: () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <AttributesSection 
        data={{
          // Bedrooms
          bedroomNumber: 4,
          bedroomType: 'Master Suite',
          totalRooms: 8,

          // Bathrooms
          totalBathrooms: 3,
          halfBathrooms: 1,
          bathStyle1: 'Modern',
          bathStyle2: 'Traditional',
          bathStyle3: 'Contemporary',

          // Kitchen
          numberOfKitchens: 1,
          kitchenType: 'Gourmet',
          kitchenStyle1: 'Modern',
          kitchenStyle2: 'Open Concept',
          kitchenStyle3: 'Island',

          // Utilities
          fireplaces: 2,
          acType: 'Central Air',
          heatType: 'Forced Air',

          // Interior
          interiorCondition: 'Excellent',
          interiorFinish: 'High End',

          // Exterior
          exteriorFinish: 'Brick',
          exteriorCondition: 'Good',
          view: 'City Skyline',
          grade: 'A',

          // Construction
          yearBuilt: 2015,
          roofCover: 'Asphalt Shingle',
          roofStructure: 'Gable',
          foundation: 'Concrete',
          landUse: 'Residential',

          // Last Transaction
          salePrice: 850000,
          saleDate: '2023-06-15',
          registryBookAndPlace: 'Book 12345, Page 678',

          // Parking
          parkingSpots: 2,
          parkingOwnership: 'Owned',
          parkingType: 'Garage',
          tandemParking: false,

          // Details
          propertyType: 'Single Family',
          livingArea: 2500,
          floor: 1,
          penthouseUnit: false,
          complex: 'None',
          storyHeight: 9,
          style: 'Contemporary',
          orientation: 'South'
        }}
      />
    </div>
  ),
};

export const PropertyValue: Story = {
  ...BaseStory,
  render: () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <PropertyValueSection 
        historicPropertyValues={{
          2018: 425000,
          2019: 432000,
          2020: 445000,
          2021: 460000,
          2022: 478500,
          2023: 492000,
          2024: 510000,
          2025: 525000
        }}
      />
    </div>
  ),
};

export const PropertyTaxes: Story = {
  ...BaseStory,
  render: () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <PropertyTaxesSection
        propertyGrossTax={9427.20}
        residentialExemption={3716.40}
        personalExemption={0}
        communityPreservation={0}
        propertyNetTax={5710.80}
        parcelId="1234567890"
      />
    </div>
  ),
};

export const Abatements: Story = {
  ...BaseStory,
  render: () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <AbatementsSection />
    </div>
  ),
};

export const ApprovedPermits: Story = {
  ...BaseStory,
  render: () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <ApprovedPermitsSection parcelId="1234567890" />
    </div>
  ),
};

export const ContactUs: Story = {
  ...BaseStory,
  render: () => (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <ContactUsSection />
    </div>
  ),
}; 