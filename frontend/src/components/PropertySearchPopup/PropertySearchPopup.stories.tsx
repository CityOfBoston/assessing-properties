import type { Meta, StoryObj } from '@storybook/react';
import { BrowserRouter } from 'react-router-dom';
import { DateProvider } from '@hooks/useDateContext';
import { ParcelPairingsProvider } from '@hooks/useParcelPairingsContext';
import { PropertySearchPopup } from './PropertySearchPopup';

const meta = {
  title: 'Components/PropertySearchPopup',
  component: PropertySearchPopup,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <BrowserRouter>
        <DateProvider>
          <ParcelPairingsProvider>
            <div style={{ height: '100vh', width: '100vw' }}>
              <Story />
            </div>
          </ParcelPairingsProvider>
        </DateProvider>
      </BrowserRouter>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof PropertySearchPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClose: () => console.log('Close clicked'),
    onSelect: (pid, fullAddress) => console.log('Selected:', pid, fullAddress),
    texts: {
      closeButtonAriaLabel: 'Close search popup',
      labelText: 'Search for a property',
      tooltipHint: 'Search by address, parcel ID, or owner name',
      placeholderText: 'Enter address, parcel ID, or owner...',
    },
  },
};

export const WithoutSelectHandler: Story = {
  args: {
    onClose: () => console.log('Close clicked'),
    texts: {
      closeButtonAriaLabel: 'Close search popup',
      labelText: 'Search for a property',
      tooltipHint: 'Search by address, parcel ID, or owner name',
      placeholderText: 'Enter address, parcel ID, or owner...',
    },
  },
}; 