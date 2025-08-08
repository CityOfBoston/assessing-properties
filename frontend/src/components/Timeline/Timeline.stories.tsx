import type { Meta, StoryObj } from '@storybook/react';
import Timeline from './Timeline';

const meta: Meta<typeof Timeline> = {
  title: 'Components/Timeline',
  component: Timeline,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    timepoints: {
      control: 'object',
    },
    selectedDate: {
      control: 'date',
    },
    year: {
      control: 'number',
    },
    minDay: {
      control: 'number',
    },
    maxDay: {
      control: 'number',
    },
    selectedDay: {
      control: 'number',
    },
    timelineWidth: {
      control: 'number',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample timepoints for 2025
const sampleTimepoints = [
  { label: 'Q1 Assessment', date: new Date(2025, 0, 1) },
  { label: 'Q2 Assessment', date: new Date(2025, 2, 31) },
  { label: 'Q3 Assessment', date: new Date(2025, 5, 30) },
  { label: 'Q4 Assessment', date: new Date(2025, 8, 30) },
  { label: 'Year End', date: new Date(2025, 11, 31) },
];

export const Default: Story = {
  args: {
    timepoints: sampleTimepoints,
    selectedDate: new Date(2025, 5, 15),
    year: 2025,
    minDay: 1,
    maxDay: 365,
    selectedDay: 166, // June 15th
    timelineWidth: 800,
  },
};

export const EarlyInYear: Story = {
  args: {
    timepoints: sampleTimepoints,
    selectedDate: new Date(2025, 1, 15),
    year: 2025,
    minDay: 1,
    maxDay: 365,
    selectedDay: 46, // February 15th
    timelineWidth: 800,
  },
};

export const LateInYear: Story = {
  args: {
    timepoints: sampleTimepoints,
    selectedDate: new Date(2025, 11, 15),
    year: 2025,
    minDay: 1,
    maxDay: 365,
    selectedDay: 349, // December 15th
    timelineWidth: 800,
  },
};

export const ManyTimepoints: Story = {
  args: {
    timepoints: [
      { label: 'Jan 1', date: new Date(2025, 0, 1) },
      { label: 'Feb 1', date: new Date(2025, 1, 1) },
      { label: 'Mar 1', date: new Date(2025, 2, 1) },
      { label: 'Apr 1', date: new Date(2025, 3, 1) },
      { label: 'May 1', date: new Date(2025, 4, 1) },
      { label: 'Jun 1', date: new Date(2025, 5, 1) },
      { label: 'Jul 1', date: new Date(2025, 6, 1) },
      { label: 'Aug 1', date: new Date(2025, 7, 1) },
      { label: 'Sep 1', date: new Date(2025, 8, 1) },
      { label: 'Oct 1', date: new Date(2025, 9, 1) },
      { label: 'Nov 1', date: new Date(2025, 10, 1) },
      { label: 'Dec 1', date: new Date(2025, 11, 1) },
    ],
    selectedDate: new Date(2025, 5, 15),
    year: 2025,
    minDay: 1,
    maxDay: 365,
    selectedDay: 166, // June 15th
    timelineWidth: 800,
  },
}; 