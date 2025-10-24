import { Meta, StoryObj } from '@storybook/react';
import ComplexFeedbackSenderContainer from './ComplexFeedbackSenderContainer';

const meta = {
  title: 'Containers/ComplexFeedbackSenderContainer',
  component: ComplexFeedbackSenderContainer,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
          A container component that manages the ComplexFeedbackSender modal state and backend integration.
          
          ## Features
          - Renders a trigger link with comment icon
          - Manages modal open/close state
          - Handles backend feedback submission
          - Determines source context from searchQuery
          - Provides success/error callbacks
          - Customizable trigger text
          
          ## Usage
          Simply drop this container anywhere you want users to be able to provide feedback.
          The searchQuery prop determines if feedback comes from search results or welcome page.
        `,
      },
    },
  },
  args: {
    // Default args for all stories
  },
} satisfies Meta<typeof ComplexFeedbackSenderContainer>;

export default meta;
type Story = StoryObj<typeof ComplexFeedbackSenderContainer>;

export const Default: Story = {
  args: {
    onSuccess: () => {
      console.log('Feedback submitted successfully!');
      alert('Thank you for your feedback!');
    },
    onError: (error) => {
      console.error('Feedback submission error:', error);
      alert(`Error: ${error.message}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Default feedback container for welcome page (no search query).',
      },
    },
  },
};

export const WithSearchQuery: Story = {
  args: {
    searchQuery: '123 Main Street Boston',
    onSuccess: () => {
      console.log('Search feedback submitted successfully!');
      alert('Thank you for your search feedback!');
    },
    onError: (error) => {
      console.error('Search feedback submission error:', error);
      alert(`Error: ${error.message}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Feedback container for search results page with search context.',
      },
    },
  },
};

export const WithCustomText: Story = {
  args: {
    linkText: 'Need help? Share your thoughts',
    onSuccess: () => {
      console.log('Custom feedback submitted successfully!');
      alert('Thank you for your thoughts!');
    },
    onError: (error) => {
      console.error('Custom feedback submission error:', error);
      alert(`Error: ${error.message}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Feedback container with custom trigger link text.',
      },
    },
  },
};

export const WithCustomAssessingLink: Story = {
  args: {
    assessingDeptUrl: 'https://www.boston.gov/departments/assessing',
    onSuccess: () => {
      console.log('Feedback with custom link submitted successfully!');
      alert('Thank you for your feedback!');
    },
    onError: (error) => {
      console.error('Feedback submission error:', error);
      alert(`Error: ${error.message}`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Feedback container with custom Assessing department link.',
      },
    },
  },
};

export const InteractiveDemo: Story = {
  args: {
    searchQuery: 'Property search demo',
    linkText: 'Try the feedback system!',
    onSuccess: () => {
      alert('🎉 Feedback submitted successfully!\n\nIn a real app, this would be saved to the database.');
    },
    onError: (error) => {
      alert(`❌ Submission failed: ${error.message}\n\nThis is just a demo - no worries!`);
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive demo showing the complete feedback flow with realistic callbacks.',
      },
    },
  },
};
