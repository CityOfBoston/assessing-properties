import { Meta, StoryObj } from '@storybook/react';
import PropertyDetailsContent from './PropertyDetailsContent';

const meta = {
  title: 'Components/PropertyDetailsContent',
  component: PropertyDetailsContent,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
          # PropertyDetailsContent
          
          This component renders different content templates based on the provided contentId.
          It acts as a router that directs to the appropriate template component.
          
          ## Content Templates
          
          - **general_information**: Displays basic property details and a link to building permits
          - More templates will be added as they are implemented
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PropertyDetailsContent>;

export default meta;
type Story = StoryObj<typeof PropertyDetailsContent>;

// Sample property data
const samplePropertyData = {
  parcelId: '0301234567',
  propertyType: 'Single Family',
  classificationCode: 'CD101',
  lotSize: '5,000 sq ft',
  livingArea: '2,200 sq ft',
  ownerAsOf: {
    name: 'Smith, John & Jane',
    date: 'Monday, January 1st 2024',
  },
  ownerMailingAddress: '123 Main St, Boston, MA 02108',
  residentialExemptions: 'Residential Exemption',
  personalExemptions: 'None',
  buildingPermitsLink: 'https://data.boston.gov/dataset/approved-building-permits',
};

export const GeneralInformation: Story = {
  args: {
    contentId: 'general_information',
    propertyData: samplePropertyData,
  },
  parameters: {
    docs: {
      description: {
        story: 'The General Information template displays basic property details and approved building permits information.',
      },
    },
  },
};

export const NoContent: Story = {
  args: {
    contentId: 'unknown_section',
    propertyData: samplePropertyData,
  },
  parameters: {
    docs: {
      description: {
        story: 'This shows the fallback UI when an unknown content ID is provided.',
      },
    },
  },
}; 