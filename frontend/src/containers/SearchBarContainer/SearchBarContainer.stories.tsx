import type { Meta, StoryObj } from '@storybook/react';
import { SearchBarContainer } from './SearchBarContainer';

const meta = {
  title: 'Container/SearchBarContainer',
  component: SearchBarContainer,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ 
        padding: '4rem 1rem', 
        backgroundColor: '#091F2F',
        minHeight: '500px',
        position: 'relative'
      }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof SearchBarContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    labelText: 'Search by address or parcel ID',
    tooltipHint: 'A unique, legal 10 digit number assigned by the City of Boston to each parcel of property.',
    placeholderText: 'Enter address or parcel ID',
  },
};

export const WithSuggestions: Story = {
  args: {
    ...Default.args,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
  },
}; 