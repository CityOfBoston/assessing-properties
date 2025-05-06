import { Meta, StoryObj } from '@storybook/react';
import FeedbackSender from './FeedbackSender';

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
        `,
      },
    },
  },
} satisfies Meta<typeof FeedbackSender>;

export default meta;
type Story = StoryObj<typeof FeedbackSender>;

export const Default: Story = {
  args: {
    onSubmit: (data) => {
      console.log('Feedback submitted:', data);
      alert(`Feedback submitted: Was it helpful? ${data.helpful}. ${data.feedback ? `Feedback: ${data.feedback}` : 'No additional feedback provided.'}`);
    },
    assessingDeptUrl: '#',
  },
};

export const WithCustomAssessingLink: Story = {
  args: {
    onSubmit: (data) => {
      console.log('Feedback submitted:', data);
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