import type { Meta, StoryObj } from '@storybook/react';
import { BetaLabel } from './BetaLabel';

const meta: Meta<typeof BetaLabel> = {
  title: 'Components/BetaLabel',
  component: BetaLabel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS class names',
    },
    variant: {
      control: 'select',
      options: ['blue', 'white'],
      description: 'Color variant of the label',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

export const WhiteVariant: Story = {
  args: {
    variant: 'white',
  },
  parameters: {
    backgrounds: { default: 'dark' },
  },
};

export const WithCustomClass: Story = {
  args: {
    className: 'custom-class',
  },
};

export const InContext: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <h2>New Feature</h2>
      <BetaLabel />
    </div>
  ),
};

export const WithHeader32px: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <h1 style={{ fontSize: '32px', margin: 0, fontFamily: 'Montserrat, sans-serif' }}>
        Property Search
      </h1>
      <BetaLabel />
    </div>
  ),
};

export const WithWhiteHeader: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '20px', backgroundColor: '#1871BD' }}>
      <h1 style={{ fontSize: '32px', margin: 0, fontFamily: 'Montserrat, sans-serif', color: 'white' }}>
        Welcome to Properties Assessment
      </h1>
      <BetaLabel variant="white" />
    </div>
  ),
};

export const WithVariousSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <h1 style={{ fontSize: '32px', margin: 0, fontFamily: 'Montserrat, sans-serif' }}>
          32px Header
        </h1>
        <BetaLabel />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <h2 style={{ fontSize: '24px', margin: 0, fontFamily: 'Montserrat, sans-serif' }}>
          24px Header
        </h2>
        <BetaLabel />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <h3 style={{ fontSize: '18px', margin: 0, fontFamily: 'Montserrat, sans-serif' }}>
          18px Header
        </h3>
        <BetaLabel />
      </div>
    </div>
  ),
};