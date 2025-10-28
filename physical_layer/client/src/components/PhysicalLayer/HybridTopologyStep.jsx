import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { simulateHybridTopology } from '../../utils/physicalLayerUtils';

const HybridTopologyStep = ({ 
  hybridTopology,
  onSimulate,
  parameters, 
  onUpdateParameters 
}) => {
  const [starNodes, setStarNodes] = useState(4);
  const [ringNodes, setRingNodes] = useState(6);
  const [busNodes, setBusNodes] = useState(5);
  const [meshNodes, setMeshNodes] = useState(3);
  const [topologyData, setTopologyData] = useState(null);

  useEffect(() => {
    performSimulation();
  }, [starNodes, ringNodes, busNodes, meshNodes]);

  const performSimulation = () => {
    const config = {
      starNodes,
      ringNodes,
      busNodes,
      meshNodes
    };
    
    const result = simulateHybridTopology(config);
    setTopologyData(result);
    
    if (onSimulate) {
      onSimulate(result);
    }
  };

  const handleParameterChange = (param, value) => {
    const numValue = parseInt(value);
    switch (param) {
      case 'starNodes':
        setStarNodes(numValue);
        break;
      case 'ringNodes':
        setRingNodes(numValue);
        break;
      case 'busNodes':
        setBusNodes(numValue);
        break;
      case 'meshNodes':
        setMeshNodes(numValue);
        break;
    }
    
    if (onUpdateParameters) {
      onUpdateParameters({ [param]: numValue });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Step 9: Hybrid Network Topology
        </h2>
        <p className="text-gray-600 mb-4">
          Combine multiple network topologies to optimize cost, performance, and reliability 
          based on specific requirements.
        </p>
        
        {/* Interactive Topology Builder Button */}
        <div className="mb-4">
          <Link 
            to="/hybrid" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <span className="text-xl">🏗️</span>
            Launch Interactive Topology Builder
            <span className="text-sm opacity-90">(Full-Featured)</span>
          </Link>
          <p className="text-sm text-gray-500 mt-2">
            🎯 Create drag-and-drop networks • 📡 Test message routing • 🔧 Advanced topology tools
          </p>
        </div>
      </div>

      {/* Configuration Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">Star Topology</h3>
          <div className="mb-2">
            <label className="block text-sm font-medium text-blue-700 mb-2">
              Nodes: {starNodes}
            </label>
            <input
              type="range"
              min="2"
              max="10"
              value={starNodes}
              onChange={(e) => handleParameterChange('starNodes', e.target.value)}
              className="slider w-full"
            />
          </div>
          <div className="text-xs text-blue-600">
            Central hub with spokes
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="text-lg font-semibold mb-3 text-green-800">Ring Topology</h3>
          <div className="mb-2">
            <label className="block text-sm font-medium text-green-700 mb-2">
              Nodes: {ringNodes}
            </label>
            <input
              type="range"
              min="3"
              max="12"
              value={ringNodes}
              onChange={(e) => handleParameterChange('ringNodes', e.target.value)}
              className="slider w-full"
            />
          </div>
          <div className="text-xs text-green-600">
            Circular connection pattern
          </div>
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="text-lg font-semibold mb-3 text-yellow-800">Bus Topology</h3>
          <div className="mb-2">
            <label className="block text-sm font-medium text-yellow-700 mb-2">
              Nodes: {busNodes}
            </label>
            <input
              type="range"
              min="2"
              max="10"
              value={busNodes}
              onChange={(e) => handleParameterChange('busNodes', e.target.value)}
              className="slider w-full"
            />
          </div>
          <div className="text-xs text-yellow-600">
            Linear shared medium
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <h3 className="text-lg font-semibold mb-3 text-red-800">Mesh Topology</h3>
          <div className="mb-2">
            <label className="block text-sm font-medium text-red-700 mb-2">
              Nodes: {meshNodes}
            </label>
            <input
              type="range"
              min="2"
              max="6"
              value={meshNodes}
              onChange={(e) => handleParameterChange('meshNodes', e.target.value)}
              className="slider w-full"
            />
          </div>
          <div className="text-xs text-red-600">
            Full interconnection
          </div>
        </div>
      </div>

      {/* Topology Analysis */}
      {topologyData && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Network Statistics</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Total Nodes:</span>
                  <span className="font-semibold">{topologyData.totalNodes}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Connections:</span>
                  <span className="font-semibold">{topologyData.totalConnections}</span>
                </div>
                <div className="flex justify-between">
                  <span>Efficiency Ratio:</span>
                  <span className="font-semibold">{topologyData.efficiency.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Reliability:</span>
                  <span className="font-semibold">{(topologyData.reliability * 100).toFixed(0)}%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Topology Breakdown</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Star Segment:</span>
                  <span>{topologyData.segments.star.nodes} nodes, {topologyData.segments.star.connections} links</span>
                </div>
                <div className="flex justify-between">
                  <span>Ring Segment:</span>
                  <span>{topologyData.segments.ring.nodes} nodes, {topologyData.segments.ring.connections} links</span>
                </div>
                <div className="flex justify-between">
                  <span>Bus Segment:</span>
                  <span>{topologyData.segments.bus.nodes} nodes, {topologyData.segments.bus.connections} links</span>
                </div>
                <div className="flex justify-between">
                  <span>Mesh Segment:</span>
                  <span>{topologyData.segments.mesh.nodes} nodes, {topologyData.segments.mesh.connections} links</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Visual Representation</h3>
              <div className="text-center">
                <div className="inline-block text-6xl mb-2">🕸️</div>
                <div className="text-sm text-gray-600">Hybrid Network</div>
                <div className="text-xs text-gray-500 mt-1">
                  {topologyData.totalNodes} nodes interconnected
                </div>
              </div>
            </div>
          </div>

          {/* Advantages */}
          <div className="mb-6">
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-3">✅ Advantages of Hybrid Topology</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topologyData.advantages.map((advantage, index) => (
                  <div key={index} className="text-sm text-green-700">
                    • {advantage}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Disadvantages */}
          <div className="mb-6">
            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
              <h3 className="font-semibold text-red-800 mb-3">❌ Disadvantages of Hybrid Topology</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {topologyData.disadvantages.map((disadvantage, index) => (
                  <div key={index} className="text-sm text-red-700">
                    • {disadvantage}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="mb-6">
            <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-3">🎯 Real-world Applications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
                <div>
                  <h4 className="font-medium mb-2">Enterprise Networks:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Star for workstations</li>
                    <li>• Ring for backbone</li>
                    <li>• Mesh for critical servers</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Internet Infrastructure:</h4>
                  <ul className="space-y-1 ml-4">
                    <li>• Mesh for core routers</li>
                    <li>• Star for access points</li>
                    <li>• Ring for metropolitan networks</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Explanation */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-2">💡 How Hybrid Topology Works:</h3>
        <div className="text-sm text-yellow-700">
          <p className="mb-2">
            <strong>Hybrid Topology combines multiple network topologies:</strong>
          </p>
          <ul className="space-y-1 ml-4">
            <li>• <strong>Star:</strong> Central hub provides easy management and expansion</li>
            <li>• <strong>Ring:</strong> Token passing ensures orderly data transmission</li>
            <li>• <strong>Bus:</strong> Cost-effective shared medium for simple connections</li>
            <li>• <strong>Mesh:</strong> Multiple paths provide high reliability and performance</li>
            <li>• <strong>Integration:</strong> Bridges and routers connect different segments</li>
            <li>• <strong>Optimization:</strong> Use expensive topologies only where needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HybridTopologyStep;