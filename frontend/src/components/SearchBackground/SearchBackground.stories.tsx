import type { Meta, StoryObj } from '@storybook/react';
import { SearchBackground } from './SearchBackground';

const meta = {
  title: 'Components/SearchBackground',
  component: SearchBackground,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <h1 style={{ color: 'white' }}>Sample Content</h1>
        <p style={{ color: 'white' }}>This is some sample content to demonstrate the background.</p>
      </>
    ),
  },
}; 