import React from 'react';
import { Link } from 'react-router-dom';

const HybridTopologyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content - Load the HTML file in iframe */}
      <main className="h-screen">
        <iframe
          src="/Hybrid_Topology.html"
          className="w-full h-full"
          title="Hybrid Topology Builder"
          style={{ border: 'none' }}
        />
      </main>
    </div>
  );
};

export default HybridTopologyPage;