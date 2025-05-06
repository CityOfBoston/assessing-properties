import type { Meta, StoryObj } from '@storybook/react';
import { RecordTable } from './RecordTable';

const meta = {
  title: 'Components/RecordTable',
  component: RecordTable,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof RecordTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// Sample data for stories
const recordData = {
  'Property ID': '0102345000',
  'Address': '25 Beacon St',
  'Owner': 'Commonwealth of Massachusetts',
  'Value': '$125,000,000',
  'Year Built': '1798',
  'Square Footage': '45,000',
  'Zoning': 'Government',
  'Last Sale Date': 'N/A'
};

export const Default: Story = {
  args: {
    data: recordData
  },
}; 