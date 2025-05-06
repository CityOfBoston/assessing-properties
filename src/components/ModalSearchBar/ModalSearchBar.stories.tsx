import { Meta, StoryObj } from '@storybook/react';
import { ModalSearchBar } from './ModalSearchBar';

const meta = {
  title: 'Components/ModalSearchBar',
  component: ModalSearchBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ModalSearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Search for a property address...',
    onSearch: (term) => alert(`Searching for: ${term}`),
  },
};

export const WithCustomPlaceholder: Story = {
  args: {
    placeholder: 'Enter address, parcel ID, or owner name...',
    onSearch: (term) => alert(`Searching for: ${term}`),
  },
}; 