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
      <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>
        <h1>Search Background Example</h1>
        <p>This is an example of content overlaid on the search background.</p>
      </div>
    ),
  },
}; 