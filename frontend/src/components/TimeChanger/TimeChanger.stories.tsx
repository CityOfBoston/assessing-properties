import React from 'react';
import TimeChanger from './TimeChanger';
import { MemoryRouter } from 'react-router-dom';

export default {
  title: 'Components/TimeChanger',
  component: TimeChanger,
};

export const Default = () => (
  <MemoryRouter>
    <TimeChanger />
  </MemoryRouter>
); 