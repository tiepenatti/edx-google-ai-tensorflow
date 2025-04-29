import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material';
import { HomePage } from './pages/HomePage';
import { SmartCam } from './pages/exercises/SmartCam/SmartCam';
import HousePricing from './pages/exercises/HousePricing/HousePricing';
import { HandwrittenDigit } from './pages/exercises/HandwrittenDigit/HandwrittenDigit';
import { FashionMnist } from './pages/exercises/FashionMnist/FashionMnist';
import { Header } from './components/Header';
import { Breadcrumbs } from './components/Breadcrumbs/Breadcrumbs';
import './styles/global.scss';

function App() {
  return (
    <Router>
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        }}
      >
        <Header />
        <Breadcrumbs />
        <Box component="main" sx={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/smart-cam" element={<SmartCam />} />
            <Route path="/house-pricing" element={<HousePricing />} />
            <Route path="/handwritten-digit" element={<HandwrittenDigit />} />
            <Route path="/fashion-recognition" element={<FashionMnist />} />
          </Routes>
        </Box>
      </Box>
    </Router>
  );
}

export default App;
