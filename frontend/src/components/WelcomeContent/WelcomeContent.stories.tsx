import type { Meta, StoryObj } from '@storybook/react';
import { WelcomeContent } from './WelcomeContent';

const meta = {
  title: 'Components/WelcomeContent',
  component: WelcomeContent,
  parameters: {
    layout: 'centered',
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

export const Default: Story = {
  args: {
    additionalContent: (
      <div style={{ 
        padding: '1rem', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '4px',
        color: 'white'
      }}>
        Additional content example
      </div>
    ),
  },
};

export const WithoutAdditionalContent: Story = {
  args: {},
};

export const MobileWithHiddenContent: Story = {
  args: {
    hideTitleAndDescriptionOnMobile: true,
    additionalContent: (
      <div style={{ 
        padding: '1rem', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '4px',
        color: 'white'
      }}>
        Additional content example
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const MobileWithVisibleContent: Story = {
  args: {
    hideTitleAndDescriptionOnMobile: false,
    additionalContent: (
      <div style={{ 
        padding: '1rem', 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        borderRadius: '4px',
        color: 'white'
      }}>
        Additional content example
      </div>
    ),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const WithAdditionalContent: Story = {
  args: {
    additionalContent: (
      <div style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.1)', 
        padding: '16px',
        borderRadius: '4px',
        textAlign: 'center'
      }}>
        <p>This is an example of additional content that will appear between the title and description on mobile, and below the description on desktop.</p>
      </div>
    ),
  },
};

export const WithCustomComponent: Story = {
  args: {
    additionalContent: (
      <div style={{ 
        display: 'flex',
        gap: '16px',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <button style={{
          padding: '8px 16px',
          backgroundColor: '#1871bd',
          border: 'none',
          borderRadius: '4px',
          color: 'white',
          cursor: 'pointer'
        }}>
          Learn More
        </button>
        <button style={{
          padding: '8px 16px',
          backgroundColor: 'transparent',
          border: '1px solid white',
          borderRadius: '4px',
          color: 'white',
          cursor: 'pointer'
        }}>
          Contact Us
        </button>
      </div>
    ),
  },
}; 