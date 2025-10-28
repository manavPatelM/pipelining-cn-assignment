import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { PhysicalLayerProvider } from './context/PhysicalLayerContext';
import PhysicalLayerSimulator from './components/PhysicalLayer/PhysicalLayerSimulator';
import HybridTopologyPage from './pages/HybridTopologyPage';

function App() {
  return (
    <Router>
      <PhysicalLayerProvider>
        <Routes>
          <Route path="/" element={<PhysicalLayerSimulator />} />
          <Route path="/hybrid" element={<HybridTopologyPage />} />
        </Routes>
      </PhysicalLayerProvider>
    </Router>
  );
}

export default App;
