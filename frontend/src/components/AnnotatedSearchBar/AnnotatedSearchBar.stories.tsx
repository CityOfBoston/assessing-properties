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
} satisfies Meta<typeof AnnotatedSearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockSuggestions = [
  { fullAddress: '123 Main St, Boston, MA 02108', parcelId: '1234567890' },
  { fullAddress: '456 Beacon St, Boston, MA 02115', parcelId: '0987654321' },
  { fullAddress: '789 Commonwealth Ave, Boston, MA 02215', parcelId: '1122334455' },
  { fullAddress: '101 Boylston St, Boston, MA 02116', parcelId: '2233445566' },
  { fullAddress: '202 Newbury St, Boston, MA 02116', parcelId: '3344556677' },
  { fullAddress: '303 Tremont St, Boston, MA 02116', parcelId: '4455667788' },
  { fullAddress: '404 Washington St, Boston, MA 02108', parcelId: '5566778899' },
  { fullAddress: '505 Summer St, Boston, MA 02210', parcelId: '6677889900' },
  { fullAddress: '606 Winter St, Boston, MA 02108', parcelId: '7788990011' },
  { fullAddress: '707 Spring St, Boston, MA 02109', parcelId: '8899001122' },
];

export const Default: Story = {
  args: {
    labelText: 'Search by address or parcel ID',
    helperText: 'A unique, legal 10 digit number assigned by the City of Boston to each parcel of property.',
    placeholderText: 'Enter address or parcel ID',
    value: '',
    onChange: () => {},
    suggestions: [],
    loading: false,
    onSearch: () => {},
  },
};

export const WithSuggestions: Story = {
  args: {
    ...Default.args,
    value: '123',
    suggestions: mockSuggestions,
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    value: '123',
    loading: true,
  },
};

export const WithError: Story = {
  args: {
    ...Default.args,
    errorMessage: 'Please enter a valid address or parcel ID',
  },
}; 