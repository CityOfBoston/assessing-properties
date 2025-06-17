import type { Meta, StoryObj } from '@storybook/react';
import ResponsiveTable from './ResponsiveTable';

const meta: Meta<typeof ResponsiveTable> = {
  title: 'Components/ResponsiveTable',
  component: ResponsiveTable,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof ResponsiveTable>;

const sampleData = [
  {
    'Parcel ID': '1234567890',
    'Address': '123 Main St, Boston, MA 02118',
    'Owner(s)': 'John Doe',
    'Assessed Value': '$1,234,567',
    'Details': null,
  },
  {
    'Parcel ID': '9876543210',
    'Address': '456 Elm St, Boston, MA 02118',
    'Owner(s)': 'Jane Smith',
    'Assessed Value': '$7,654,321',
    'Details': null,
  },
];

export const Default: Story = {
  args: {
    data: sampleData,
  },
};

export const WithDetails: Story = {
  args: {
    data: sampleData,
    showDetails: true,
  },
};

export const WithDetailsAndMap: Story = {
  args: {
    data: sampleData,
    showDetails: true,
    showMapLink: true,
  },
};

export const Empty: Story = {
  args: {
    data: [],
  },
}; 