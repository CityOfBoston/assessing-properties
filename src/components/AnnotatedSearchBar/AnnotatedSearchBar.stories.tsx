import type { Meta, StoryObj } from '@storybook/react';
import { AnnotatedSearchBar } from './AnnotatedSearchBar';

const meta = {
  title: 'Components/AnnotatedSearchBar',
  component: AnnotatedSearchBar,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof AnnotatedSearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    labelText: 'Search by address or parcel ID',
    tooltipHint: 'A parcel ID, also known as a property identification number (PIN) or assessor\'s parcel number (APN), is a unique identifier assigned to a specific piece of land by local government authorities.',
    searchHint: 'Example: 1 City Hall Sq | 0504203000 | 352R Blue Hill Ave Apt # 3',
    placeholderText: 'Enter address or parcel ID',
    onSearch: (searchTerm) => {
      console.log('Search term:', searchTerm);
    },
  },
};

export const WithError: Story = {
  args: {
    labelText: 'Search by address or parcel ID',
    tooltipHint: 'A parcel ID, also known as a property identification number (PIN) or assessor\'s parcel number (APN), is a unique identifier assigned to a specific piece of land by local government authorities.',
    searchHint: 'Example: 1 City Hall Sq | 0504203000 | 352R Blue Hill Ave Apt # 3',
    placeholderText: 'Enter address or parcel ID',
    errorMessage: 'Please enter a valid address or parcel ID',
    onSearch: (searchTerm) => {
      console.log('Search term:', searchTerm);
    },
  },
}; 