import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import SearchResultsPage from './SearchResultsPage';

export default {
  title: 'Pages/SearchResultsPage',
  component: SearchResultsPage,
  parameters: {
    layout: 'fullscreen',
  },
};

export const Default = () => (
  <MemoryRouter initialEntries={['/search?search=123 Main St']}>
    <Routes>
      <Route path="/search" element={<SearchResultsPage />} />
    </Routes>
  </MemoryRouter>
);

export const NoResults = () => (
  <MemoryRouter initialEntries={['/search?search=notfound']}>
    <Routes>
      <Route path="/search" element={<SearchResultsPage />} />
    </Routes>
  </MemoryRouter>
); 