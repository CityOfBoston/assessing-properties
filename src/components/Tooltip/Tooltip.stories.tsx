import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '8rem', display: 'flex', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    hint: 'A parcel ID, also known as a property identification number (PIN) or assessor\'s parcel number (APN), is a unique identifier assigned to a specific piece of land by local government authorities. It\'s used to track and manage property information, including tax assessments, property records, and land registration.',
  },
}; 