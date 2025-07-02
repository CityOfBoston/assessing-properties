import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from '@pages/WelcomePage';
import SearchResultsPage from '@pages/SearchResultsPage';
import PropertyDetailsPage from '@src/pages/PropertyDetailsPage';
import { ParcelPairingsProvider } from '@src/hooks/useParcelPairingsContext';
import '@styles/main.scss';

export const App = () => {
  return (
    <ParcelPairingsProvider>
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/details" element={<PropertyDetailsPage />} />
      </Routes>
    </Router>
    </ParcelPairingsProvider>
  );
};

export default App; 