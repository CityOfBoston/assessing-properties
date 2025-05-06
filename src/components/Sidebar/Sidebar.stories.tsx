import { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';

const meta = {
  title: 'Components/Sidebar',
  component: Sidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Assessing',
    navItems: [
      {
        label: 'General Information',
        url: '#general-information',
        isActive: true,
      },
      {
        label: 'Value and Tax Information',
        url: '#value-tax-information',
      },
      {
        label: 'Abatements and Exemptions',
        url: '#abatements-exemptions',
      },
      {
        label: 'Property Attributes',
        url: '#property-attributes',
      },
      {
        label: 'Value History',
        url: '#value-history',
      }
    ]
  },
}; 