import { Meta, StoryObj } from '@storybook/react';
import { PropertySubHeader } from './PropertySubHeader';

const meta = {
  title: 'Components/PropertySubHeader',
  component: PropertySubHeader,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PropertySubHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    address: '1 City Hall Square, Boston, MA 02201',
    onExport: () => alert('Export clicked'),
    onPayTaxes: () => alert('Pay Taxes clicked'),
  },
};

export const LongAddress: Story = {
  args: {
    address: '1234 Commonwealth Avenue, Apartment 567, Brighton, Boston, Massachusetts 02135-1234, United States of America',
    onExport: () => alert('Export clicked'),
    onPayTaxes: () => alert('Pay Taxes clicked'),
  },
}; 