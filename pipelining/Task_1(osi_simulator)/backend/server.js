const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    message: err.message
  });
});

const osiLayers = [
  {
    id: 7,
    name: "Application Layer",
    protocol: "HTTP",
    function: "User interaction",
    headerAdded: "HTTP Header",
    color: "#ef4444",
    simulationUrl: "https://group7-application-layer-sim.com",
    headerSize: 0
  },
  {
    id: 6,
    name: "Presentation Layer",
    protocol: "SSL/TLS",
    function: "Encryption/Compression",
    headerAdded: "Encryption Header",
    color: "#f97316",
    simulationUrl: "https://group6-presentation-layer-sim.com",
    headerSize: 100
  },
  {
    id: 5,
    name: "Session Layer",
    protocol: "Session",
    function: "Session management",
    headerAdded: "Session ID",
    color: "#eab308",
    simulationUrl: "https://group5-session-layer-sim.com",
    headerSize: 50
  },
  {
    id: 4,
    name: "Transport Layer",
    protocol: "TCP/UDP",
    function: "Segmentation, Reliability",
    headerAdded: "TCP Header",
    color: "#22c55e",
    simulationUrl: "https://group4-transport-layer-sim.com",
    headerSize: 20
  },
  {
    id: 3,
    name: "Network Layer",
    protocol: "IP",
    function: "Logical addressing",
    headerAdded: "IP Header",
    color: "#3b82f6",
    simulationUrl: "https://group3-network-layer-sim.com",
    headerSize: 20
  },
  {
    id: 2,
    name: "Data Link Layer",
    protocol: "Ethernet",
    function: "Physical addressing, error detection",
    headerAdded: "MAC + Trailer",
    color: "#8b5cf6",
    simulationUrl: "https://group2-datalink-layer-sim.com",
    headerSize: 26
  },
  {
    id: 1,
    name: "Physical Layer",
    protocol: "Bits",
    function: "Transmission over medium",
    headerAdded: "Binary Signal",
    color: "#ec4899",
    simulationUrl: "https://group1-physical-layer-sim.com",
    headerSize: 0
  }
];

app.get('/api/dataflow/layers', (req, res) => {
  res.json({ success: true, layers: osiLayers });
});

app.post('/api/dataflow/transmit', (req, res) => {
  try {
    const { message } = req.body;
    
    // Validation
    if (!message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
      });
    }

    if (typeof message !== 'string') {
      return res.status(400).json({ 
        success: false, 
        error: 'Message must be a string' 
      });
    }
    
    if (message.length < 1 || message.length > 100) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message must be between 1 and 100 characters',
        currentLength: message.length
      });
    }

    const originalSize = message.length;
    let currentSize = originalSize;
    const packetFlow = [];

    // Calculate packet flow through each layer
    osiLayers.forEach(layer => {
      currentSize += layer.headerSize;
      packetFlow.push({
        layerId: layer.id,
        layerName: layer.name,
        protocol: layer.protocol,
        headerAdded: layer.headerAdded,
        packetSize: currentSize,
        headerSize: layer.headerSize
      });
    });

    const totalOverhead = currentSize - originalSize;
    const overheadPercentage = ((totalOverhead / currentSize) * 100).toFixed(1);
    
    // Calculate estimated transmission time (simulated)
    const baseTime = 2.5; // Base time per layer
    const estimatedTime = (baseTime * osiLayers.length).toFixed(1);

    res.json({
      success: true,
      message,
      originalSize,
      finalSize: currentSize,
      totalOverhead,
      overheadPercentage,
      packetFlow,
      estimatedTime: parseFloat(estimatedTime),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in transmit endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process transmission',
      message: error.message
    });
  }
});

app.get('/api/dataflow/packet/:layer', (req, res) => {
  const layerId = parseInt(req.params.layer);
  const layer = osiLayers.find(l => l.id === layerId);
  
  if (!layer) {
    return res.status(404).json({ success: false, error: 'Layer not found' });
  }

  res.json({ success: true, layer });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🌐 OSI Layer Simulator - Backend API v2.0.0       ║
║                                                       ║
║   Server running on: http://localhost:${PORT}         ║
║   Health check: http://localhost:${PORT}/api/health   ║
║                                                       ║
║   Status: ✅ Ready to accept connections             ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});
