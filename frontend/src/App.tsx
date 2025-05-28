import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { WelcomePage } from './pages/WelcomePage';
import { PropertySearchPage } from './pages/PropertySearchResults';
import '@styles/main.scss';

export const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/search" element={<PropertySearchPage results={[]} searchQuery="" />} />
      </Routes>
    </Router>
  );
};

export default App; 