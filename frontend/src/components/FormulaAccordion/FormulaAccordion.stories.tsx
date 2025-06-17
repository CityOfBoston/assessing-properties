import type { Meta, StoryObj } from '@storybook/react';
import FormulaAccordion from './FormulaAccordion';

const meta: Meta<typeof FormulaAccordion> = {
  title: 'Components/FormulaAccordion',
  component: FormulaAccordion,
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormulaAccordion>;

const sampleOptions = [
  {
    title: <span>Base Value</span>,
    value: <span>$500,000</span>,
    message: 'This is the starting value for the calculation',
    description: 'The base value is determined by the property assessment.',
  },
  {
    title: <span>Adjustment Factor</span>,
    value: <span>1.05</span>,
    message: 'Annual adjustment factor',
    description: 'This factor accounts for market changes and inflation.',
  },
  {
    title: <span>Final Value</span>,
    value: <span>$525,000</span>,
  },
];

export const Default: Story = {
  args: {
    drawerOptions: sampleOptions,
  },
};

export const WithMessageOnly: Story = {
  args: {
    drawerOptions: [
      {
        title: <span>Base Value</span>,
        value: <span>$500,000</span>,
        message: 'This is the starting value for the calculation',
      },
      {
        title: <span>Final Value</span>,
        value: <span>$525,000</span>,
      },
    ],
  },
};

export const WithDescriptionOnly: Story = {
  args: {
    drawerOptions: [
      {
        title: <span>Base Value</span>,
        value: <span>$500,000</span>,
        description: 'The base value is determined by the property assessment.',
      },
      {
        title: <span>Final Value</span>,
        value: <span>$525,000</span>,
      },
    ],
  },
};

export const WithComplexContent: Story = {
  args: {
    drawerOptions: [
      {
        title: (
          <div>
            <div>Base Value</div>
            <div style={{ fontSize: '0.8em', color: '#666' }}>Starting point</div>
          </div>
        ),
        value: (
          <div>
            <div>$500,000</div>
            <div style={{ fontSize: '0.8em', color: '#666' }}>Initial</div>
          </div>
        ),
        message: 'This is the starting value for the calculation',
        description: 'The base value is determined by the property assessment.',
      },
      {
        title: <span>Final Value</span>,
        value: <span>$525,000</span>,
      },
    ],
  },
}; 