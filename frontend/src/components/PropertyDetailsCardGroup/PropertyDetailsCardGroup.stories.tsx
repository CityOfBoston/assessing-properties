import type { Meta, StoryObj } from '@storybook/react';
import PropertyDetailsCardGroup from './PropertyDetailsCardGroup';

const meta: Meta<typeof PropertyDetailsCardGroup> = {
  title: 'Components/PropertyDetailsCardGroup',
  component: PropertyDetailsCardGroup,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PropertyDetailsCardGroup>;

const sampleCards = [
  {
    icon: <img src="/cob-uswds/img/usa-icons/file_download.svg" alt="Property icon" />,
    header: 'Property Type',
    value: 'Single Family',
  },
  {
    icon: <img src="/cob-uswds/img/usa-icons/file_download.svg" alt="Year icon" />,
    header: 'Year Built',
    value: '1920',
  },
  {
    icon: <img src="/cob-uswds/img/usa-icons/file_download.svg" alt="Area icon" />,
    header: 'Living Area',
    value: '2,500 sq ft',
  },
  {
    icon: <img src="/cob-uswds/img/usa-icons/file_download.svg" alt="Rooms icon" />,
    header: 'Total Rooms',
    value: '8',
  },
  {
    icon: <img src="/cob-uswds/img/usa-icons/file_download.svg" alt="Bedrooms icon" />,
    header: 'Bedrooms',
    value: '3',
  },
  {
    icon: <img src="/cob-uswds/img/usa-icons/file_download.svg" alt="Bathrooms icon" />,
    header: 'Bathrooms',
    value: '2.5',
  },
];

export const Default: Story = {
  args: {
    cards: sampleCards,
  },
};

export const TwoCardsPerRow: Story = {
  args: {
    cards: sampleCards,
    maxCardsPerRow: 2,
  },
};

export const ThreeCardsPerRow: Story = {
  args: {
    cards: sampleCards,
    maxCardsPerRow: 3,
  },
};

export const FewerCardsThanMax: Story = {
  args: {
    cards: sampleCards.slice(0, 2), // Only first two cards
    maxCardsPerRow: 4,
  },
};

export const ManyCards: Story = {
  args: {
    cards: [...sampleCards, ...sampleCards], // Duplicate the sample cards to show more
  },
}; 