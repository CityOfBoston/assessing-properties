import React from 'react';
import TimeChanger from './TimeChanger';
import { BrowserRouter } from 'react-router-dom';
import { DateProvider } from '@hooks/useDateContext';

export default {
  title: 'Components/TimeChanger',
  component: TimeChanger,
  decorators: [
    (Story: React.ComponentType) => (
      <BrowserRouter>
        <DateProvider>
          <Story />
        </DateProvider>
      </BrowserRouter>
    ),
  ],
};

export const Default = () => <TimeChanger />; 