import type { Meta, StoryObj } from '@storybook/react';
import { PropertySearchHelp } from './PropertySearchHelp';

const meta = {
  title: 'Components/PropertySearchHelp',
  component: PropertySearchHelp,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof PropertySearchHelp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    searchQuery: '09765',
    searchTips: [
      {
        title: 'Check the street name spelling.',
        description: 'Make sure the street name is spelled correctly.'
      },
      {
        title: 'Verify the street number.',
        description: 'Ensure the street number is accurate. Do not include apartment numbers or extensions like letters or dashes (e.g., 123A or 123-1)'
      },
      {
        title: 'Use directionals correctly.',
        description: 'For directional street names, use abbreviations. For example, instead of "West Second Street," enter "W Second".'
      },
      {
        title: 'Use common abbreviations.',
        description: 'Street names may include abbreviations. For instance, "Saint Rose" might appear as "St Rose". Also, note that punctuation is not used in street names.'
      }
    ]
  },
}; 