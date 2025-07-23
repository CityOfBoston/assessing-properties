import type { Meta, StoryObj } from '@storybook/react';
import MessageBox from './MessageBox';

const meta: Meta<typeof MessageBox> = {
  title: 'Components/MessageBox',
  component: MessageBox,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MessageBox>;

export const Default: Story = {
  args: {
    children: 'This is a message box with a blue background, rounded corners, and full width.',
  },
};

export const WithCustomContent: Story = {
  args: {
    children: (
      <div>
        <strong>Important:</strong> This is a <em>custom</em> message box.<br />
        <ul>
          <li>Blue background</li>
          <li>Rounded corners</li>
          <li>Full width</li>
        </ul>
      </div>
    ),
  },
}; 