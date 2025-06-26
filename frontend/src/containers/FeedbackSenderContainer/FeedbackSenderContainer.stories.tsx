import type { Meta, StoryObj } from '@storybook/react';
import { FeedbackSenderContainer } from './FeedbackSenderContainer';

const meta: Meta<typeof FeedbackSenderContainer> = {
  title: 'Containers/FeedbackSenderContainer',
  component: FeedbackSenderContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    parcelId: {
      control: 'text',
      description: 'The parcel ID for the property being reviewed',
    },
    assessingDeptUrl: {
      control: 'text',
      description: 'URL for the assessing department contact link',
    },
    onSuccess: {
      action: 'success',
      description: 'Callback when feedback is successfully sent',
    },
    onError: {
      action: 'error',
      description: 'Callback when feedback fails to send',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    parcelId: '123456789',
    assessingDeptUrl: 'https://example.com/assessing',
  },
};

export const WithoutParcelId: Story = {
  args: {
    assessingDeptUrl: 'https://example.com/assessing',
  },
};

export const CustomAssessingDeptUrl: Story = {
  args: {
    parcelId: '987654321',
    assessingDeptUrl: 'https://city.gov/assessing-department',
  },
}; 