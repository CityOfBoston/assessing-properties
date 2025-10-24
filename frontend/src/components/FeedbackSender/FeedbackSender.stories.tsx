import { Meta, StoryObj } from '@storybook/react';
import FeedbackSender from './FeedbackSender';

// Default text content for stories
const defaultTexts = {
  question: 'Was this page helpful?',
  yesLabel: 'Yes',
  noLabel: 'No',
  promptTitle: 'Tell us why',
  promptOptional: '(Optional)',
  disclaimer: 'Do not include sensitive information such as account numbers or personal details.',
  submitButton: 'Submit feedback',
  characterCount: '{count} characters allowed',
  characterRemaining: '{count} characters remaining',
  contactInfo: 'For additional help, please contact the',
  departmentLinkText: 'Assessing Department',
};

const meta = {
  title: 'Components/FeedbackSender',
  component: FeedbackSender,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
          A feedback form component that allows users to provide feedback on page content.
          
          ## Features
          - Radio buttons for Yes/No feedback
          - Optional text area for additional feedback
          - Character counter for text input
          - Custom styling with boxed radio buttons and specialized typography
          - Analytics tracking integration
          - Error handling
          - Accessibility support
        `,
      },
    },
  },
  args: {
    texts: defaultTexts, // Default texts for all stories
  },
} satisfies Meta<typeof FeedbackSender>;

export default meta;
type Story = StoryObj<typeof FeedbackSender>;

export const Default: Story = {
  args: {
    onSubmit: async (data) => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      alert(`Feedback submitted: Was it helpful? ${data.helpful}. ${data.feedback ? `Feedback: ${data.feedback}` : 'No additional feedback provided.'}`);
    },
    assessingDeptUrl: '#',
  },
};

export const WithParcelId: Story = {
  args: {
    onSubmit: async (data) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      alert(`Feedback submitted for parcel ${data.parcelId}: Was it helpful? ${data.helpful}. ${data.feedback ? `Feedback: ${data.feedback}` : 'No additional feedback provided.'}`);
    },
    assessingDeptUrl: '#',
    parcelId: '1234567890',
  },
  parameters: {
    docs: {
      description: {
        story: 'This variant demonstrates the component with a parcel ID context for property-specific feedback.',
      },
    },
  },
};

export const WithCustomAssessingLink: Story = {
  args: {
    onSubmit: async (data) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      alert(`Feedback submitted: Was it helpful? ${data.helpful}. ${data.feedback ? `Feedback: ${data.feedback}` : 'No additional feedback provided.'}`);
    },
    assessingDeptUrl: 'https://www.boston.gov/departments/assessing',
  },
  parameters: {
    docs: {
      description: {
        story: 'This variant demonstrates the component with a custom link to the Assessing department.',
      },
    },
  },
};

export const WithError: Story = {
  args: {
    onSubmit: async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      throw new Error('Failed to submit feedback');
    },
    assessingDeptUrl: '#',
  },
  parameters: {
    docs: {
      description: {
        story: 'This variant demonstrates error handling when feedback submission fails.',
      },
    },
  },
};

export const WithCustomTexts: Story = {
  args: {
    onSubmit: async (data) => {
      await new Promise(resolve => setTimeout(resolve, 500));
      alert(`Feedback submitted: Was it helpful? ${data.helpful}. ${data.feedback ? `Feedback: ${data.feedback}` : 'No additional feedback provided.'}`);
    },
    assessingDeptUrl: '#',
    texts: {
      ...defaultTexts,
      question: 'Did you find what you were looking for?',
      yesLabel: 'Found it!',
      noLabel: 'Still looking',
      promptTitle: 'Share your experience',
      submitButton: 'Send feedback',
    },
  },
  parameters: {
    docs: {
      description: {
        story: 'This variant demonstrates the component with customized text content.',
      },
    },
  },
}; 