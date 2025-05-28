import type { Meta, StoryObj } from '@storybook/react';
import { PropertySearchPopup } from './PropertySearchPopup';

const meta = {
  title: 'Components/PropertySearchPopup',
  component: PropertySearchPopup,
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', width: '100vw' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof PropertySearchPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onClose: () => console.log('Close clicked'),
    onSelect: (pid, fullAddress) => console.log('Selected:', { pid, fullAddress }),
  },
};

export const WithoutSelectHandler: Story = {
  args: {
    onClose: () => console.log('Close clicked'),
  },
}; 