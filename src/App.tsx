import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { SmartCam } from './pages/exercises/SmartCam/SmartCam';
import './styles/global.scss';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/smart-cam" element={<SmartCam />} />
      </Routes>
    </Router>
  );
}

export default App;
