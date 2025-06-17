import { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const meta = {
  title: 'Components/IconButton',
  component: IconButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    src: '/cob-uswds/img/usa-icons/file_download.svg',
    text: 'Export',
  },
};

export const WithOnClick: Story = {
  args: {
    src: '/cob-uswds/img/usa-icons/file_download.svg',
    text: 'Export',
    onClick: () => alert('Button clicked!'),
  },
}; 