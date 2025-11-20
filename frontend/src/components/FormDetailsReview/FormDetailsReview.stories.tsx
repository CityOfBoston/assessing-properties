import type { Meta, StoryObj } from '@storybook/react';
import FormDetailsReview from './FormDetailsReview';

const mockPropertyData = {
  parcelId: '0123456789',
  owner: ['John Doe', 'Jane Doe'],
  address: '123 Main Street, Boston, MA 02101',
  assessedValue: 500000,
};

const meta = {
  title: 'Components/FormDetailsReview',
  component: FormDetailsReview,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
          A component for reviewing form type and property details before PDF generation.
          
          ## Features
          - Form type badge and description
          - Property information display
          - Info box with instructions
          - Generate button with loading state
          - Responsive design
          - Accessibility support
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormDetailsReview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ResidentialExemption: Story = {
  args: {
    formType: 'residential',
    propertyData: mockPropertyData,
    isLoading: false,
    onGenerate: () => console.log('Generate clicked'),
  },
};

export const PersonalExemption: Story = {
  args: {
    formType: 'personal',
    propertyData: mockPropertyData,
    isLoading: false,
    onGenerate: () => console.log('Generate clicked'),
  },
};

export const Abatement: Story = {
  args: {
    formType: 'abatement',
    propertyData: mockPropertyData,
    isLoading: false,
    onGenerate: () => console.log('Generate clicked'),
  },
};

export const Loading: Story = {
  args: {
    formType: 'residential',
    propertyData: mockPropertyData,
    isLoading: true,
    onGenerate: () => console.log('Generate clicked'),
  },
};

export const SingleOwner: Story = {
  args: {
    formType: 'residential',
    propertyData: {
      ...mockPropertyData,
      owner: ['John Doe'],
    },
    isLoading: false,
    onGenerate: () => console.log('Generate clicked'),
  },
};

