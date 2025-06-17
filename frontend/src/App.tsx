import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import WelcomePage from '@pages/WelcomePage';
import SearchResultsPage from '@pages/SearchResultsPage';
import PropertyDetailsPage from '@src/pages/PropertyDetailsPage';
import '@styles/main.scss';

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/search" element={<SearchResultsPage />} />
        <Route path="/details" element={<PropertyDetailsPage />} />
      </Routes>
    </Router>
  );
};

export default App; 