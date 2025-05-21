import type { Meta, StoryObj } from '@storybook/react';
import { PropertySearchResults } from './PropertySearchResults';

const meta = {
  title: 'Components/PropertySearchResults',
  component: PropertySearchResults,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PropertySearchResults>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockProperties = [
  {
    parcelId: '0102345000',
    address: '25 Beacon St',
    owner: 'Commonwealth of Massachusetts',
    value: '$125,000,000',
  },
  {
    parcelId: '0304567000',
    address: '1 City Hall Plaza',
    owner: 'City of Boston',
    value: '$96,750,000',
  },
  {
    parcelId: '0203456100',
    address: '100 Huntington Ave',
    owner: 'Prudential Tower LLC',
    value: '$210,450,000',
  },
  {
    parcelId: '0407865000',
    address: '200 Clarendon St',
    owner: 'Boston Properties',
    value: '$375,800,000',
  },
  {
    parcelId: '0508976000',
    address: '4 Jersey St',
    owner: 'Fenway Park Sports LLC',
    value: '$145,600,000',
  },
  {
    parcelId: '0609087000',
    address: '700 Boylston St',
    owner: 'Boston Public Library',
    value: '$112,700,000',
  },
  {
    parcelId: '0710198000',
    address: '465 Huntington Ave',
    owner: 'Museum of Fine Arts',
    value: '$98,500,000',
  },
];

export const Default: Story = {
  args: {
    results: mockProperties,
  },
};

export const ThreeResults: Story = {
  args: {
    results: mockProperties.slice(0, 3),
  },
};

export const OneResult: Story = {
  args: {
    results: mockProperties.slice(0, 1),
  },
}; 