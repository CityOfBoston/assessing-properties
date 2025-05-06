import { Meta, StoryObj } from '@storybook/react';
import { PropertySearchModal } from './PropertySearchModal';
import PropertySearchHelp from '../PropertySearchHelp';
import PropertySearchResults from '../PropertySearchResults';

// Mock data
const searchTips = [
  {
    title: 'Try using a different format',
    description: 'Use "123 Main St" instead of "123 Main Street"'
  },
  {
    title: 'Check for typos',
    description: 'Make sure all words are spelled correctly'
  },
  {
    title: 'Try using a parcel ID',
    description: 'If you know the parcel ID, enter it directly'
  }
];

const mockProperties = [
  {
    parcelId: '0504203000',
    address: '1 City Hall Square',
    owner: 'City of Boston',
    value: '$10,000,000'
  },
  {
    parcelId: '1234567890',
    address: '2 Beacon Street',
    owner: 'Commonwealth of Massachusetts',
    value: '$8,500,000'
  },
  {
    parcelId: '0987654321',
    address: '100 Tremont Street',
    owner: 'Boston Properties LLC',
    value: '$12,300,000'
  }
];

const meta = {
  title: 'Components/PropertySearchModal',
  component: PropertySearchModal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PropertySearchModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Assessing',
    showResults: false,
    searchHelpComponent: (
      <PropertySearchHelp
        searchQuery="123 Main St"
        searchTips={searchTips}
      />
    ),
    onSearch: (term) => console.log(`Searching for: ${term}`)
  },
};

export const WithResults: Story = {
  args: {
    title: 'Assessing',
    showResults: true,
    searchResultsComponent: (
      <PropertySearchResults
        results={mockProperties}
      />
    ),
    searchHelpComponent: (
      <PropertySearchHelp
        searchQuery="123 Main St"
        searchTips={searchTips}
      />
    ),
    onSearch: (term) => console.log(`Searching for: ${term}`)
  },
}; 