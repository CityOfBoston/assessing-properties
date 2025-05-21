import type { Meta, StoryObj } from '@storybook/react';
import { WelcomeContent } from './WelcomeContent';

const meta = {
  title: 'Components/WelcomeContent',
  component: WelcomeContent,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ padding: '2rem', backgroundColor: '#091F2F' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof WelcomeContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {}; 