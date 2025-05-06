import type { Meta, StoryObj } from '@storybook/react';
import { FieldTable } from './FieldTable';

const meta = {
  title: 'Components/FieldTable',
  component: FieldTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FieldTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for stories
const tableData = [
  {
    'Property': '123 Main St',
    'Value': '$450,000',
    'Year Built': '1985',
    'Square Footage': '2,400'
  },
  {
    'Property': '456 Oak Ave',
    'Value': '$580,000',
    'Year Built': '1992',
    'Square Footage': '3,100'
  },
  {
    'Property': '789 Pine Rd',
    'Value': '$320,000',
    'Year Built': '1978',
    'Square Footage': '1,800'
  }
];

export const Default: Story = {
  args: {
    data: tableData
  },
}; 