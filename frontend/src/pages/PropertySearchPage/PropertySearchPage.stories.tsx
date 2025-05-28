import type { Meta, StoryObj } from '@storybook/react';
import { PropertySearchPage } from './PropertySearchPage';
import { ParcelId } from '@src/types';

const meta = {
  title: 'Pages/PropertySearchPage',
  component: PropertySearchPage,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PropertySearchPage>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper function to create ParcelId with logging
const createParcelId = (id: number) => {
  console.log('Creating ParcelId with:', id);
  console.log('String length:', id.toString().length);
  try {
    const parcelId = ParcelId.create(id);
    console.log('Successfully created ParcelId:', parcelId.toString());
    return parcelId;
  } catch (error) {
    console.error('Error creating ParcelId:', error);
    throw error;
  }
};

// Sample data for populated state
const sampleResults = [
  {
    parcelId: createParcelId(1023450000),
    fullAddress: '25 Beacon St',
    owners: ['Commonwealth of Massachusetts'],
    value: 125000000,
  },
  {
    parcelId: createParcelId(1023450001),
    fullAddress: '1 City Hall Plaza',
    owners: ['City of Boston'],
    value: 75000000,
  },
  {
    parcelId: createParcelId(1023450002),
    fullAddress: '100 Federal St',
    owners: ['Federal Reserve Bank of Boston'],
    value: 250000000,
  }
];

export const EmptyState: Story = {
  args: {
    results: [],
    searchQuery: 'nonexistent address',
  },
};

export const WithResults: Story = {
  args: {
    results: sampleResults,
    searchQuery: 'beacon',
  },
}; 