import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import TestPage from './pages/TestPage';
import ResultPage from './pages/ResultPage';
import StatsPage from './pages/StatsPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/result/:type" element={<ResultPage />} />
        <Route path="/stats" element={<StatsPage />} />
      </Routes>
    </HashRouter>
  );
}
