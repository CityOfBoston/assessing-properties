import type { Meta, StoryObj } from '@storybook/react';
import PropertyDetailsCard from './PropertyDetailsCard';

const meta: Meta<typeof PropertyDetailsCard> = {
  title: 'Components/PropertyDetailsCard',
  component: PropertyDetailsCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PropertyDetailsCard>;

export const WithIcon: Story = {
  args: {
    icon: <img src="/cob-uswds/img/usa-icons/file_download.svg" alt="Property icon" />,
    header: 'Property Type',
    value: 'Single Family',
  },
};

export const WithoutIcon: Story = {
  args: {
    header: 'Year Built',
    value: '1920',
  },
};

export const LongContent: Story = {
  args: {
    icon: <img src="/cob-uswds/img/usa-icons/file_download.svg" alt="Property icon" />,
    header: 'Property Description',
    value: 'This is a very long property description that might wrap to multiple lines to demonstrate how the card handles longer content.',
  },
}; 