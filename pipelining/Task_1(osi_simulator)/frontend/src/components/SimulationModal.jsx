import { motion } from 'framer-motion'
import { X, Network, Wifi, Database, Shield, Globe, Layers, Radio } from 'lucide-react'

const SimulationModal = ({ layer, onClose }) => {
  const getLayerIcon = (layerId) => {
    const icons = {
      7: Globe,
      6: Shield,
      5: Database,
      4: Network,
      3: Layers,
      2: Wifi,
      1: Radio
    }
    return icons[layerId] || Network
  }

  // Get iframe URL based on layer
  const getIframeUrl = (layerId) => {
    const urls = {
      7: 'https://group7-application-layer-sim.com',
      6: 'https://group6-presentation-layer-sim.com',
      5: 'https://group5-session-layer-sim.com',
      4: 'https://group4-transport-layer-sim.com',
      3: 'https://group3-network-layer-sim.com',
      2: 'https://group2-datalink-layer-sim.com',
      1: 'https://group1-physical-layer-sim.com'
    }
    return urls[layerId] || layer.simulationUrl
  }

  const getLayerVisualization = (layerId) => {
    switch(layerId) {
      case 7: // Application
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="bg-blue-500/20 border-2 border-blue-500 rounded-lg p-6 text-center">
                <Globe size={48} className="mx-auto mb-2" />
                <p className="font-bold">User Application</p>
                <p className="text-sm text-gray-400">Web Browser</p>
              </div>
              <div className="text-4xl">→</div>
              <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-6 text-center">
                <Network size={48} className="mx-auto mb-2" />
                <p className="font-bold">HTTP Request</p>
                <p className="text-sm text-gray-400">GET /data</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 font-mono text-sm">
              <p className="text-green-400">GET /api/data HTTP/1.1</p>
              <p className="text-blue-400">Host: example.com</p>
              <p className="text-yellow-400">User-Agent: Browser/1.0</p>
            </div>
          </div>
        )
      case 6: // Presentation
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-6 text-center">
                <p className="font-bold mb-2">Plain Text</p>
                <p className="text-sm font-mono">Hello World</p>
              </div>
              <div className="text-4xl">🔒</div>
              <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-6 text-center">
                <Shield size={48} className="mx-auto mb-2" />
                <p className="font-bold">Encrypted</p>
                <p className="text-sm font-mono">aF3x9K...</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="font-bold mb-2">Encryption</p>
                <p className="text-sm text-gray-400">SSL/TLS, AES-256</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4 text-center">
                <p className="font-bold mb-2">Compression</p>
                <p className="text-sm text-gray-400">GZIP, Deflate</p>
              </div>
            </div>
          </div>
        )
      case 5: // Session
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="bg-purple-500/20 border-2 border-purple-500 rounded-lg p-6 text-center flex-1">
                <Database size={48} className="mx-auto mb-2" />
                <p className="font-bold">Session ID</p>
                <p className="text-sm font-mono">abc123xyz</p>
              </div>
              <div className="text-4xl">↔️</div>
              <div className="bg-blue-500/20 border-2 border-blue-500 rounded-lg p-6 text-center flex-1">
                <p className="font-bold">Connection</p>
                <p className="text-sm text-green-400">Active</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="font-bold mb-2">Session Management</p>
              <div className="space-y-1 text-sm">
                <p>✅ Session Established</p>
                <p>✅ Authentication Complete</p>
                <p>✅ Data Synchronization Active</p>
              </div>
            </div>
          </div>
        )
      case 4: // Transport
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-6 text-center flex-1">
                <Network size={48} className="mx-auto mb-2" />
                <p className="font-bold">Source Port</p>
                <p className="text-sm font-mono">:8080</p>
              </div>
              <div className="text-4xl">→</div>
              <div className="bg-blue-500/20 border-2 border-blue-500 rounded-lg p-6 text-center flex-1">
                <Network size={48} className="mx-auto mb-2" />
                <p className="font-bold">Dest Port</p>
                <p className="text-sm font-mono">:443</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-white/5 rounded p-2">
                <p className="font-bold">SYN</p>
                <p className="text-green-400">✓</p>
              </div>
              <div className="bg-white/5 rounded p-2">
                <p className="font-bold">SYN-ACK</p>
                <p className="text-green-400">✓</p>
              </div>
              <div className="bg-white/5 rounded p-2">
                <p className="font-bold">ACK</p>
                <p className="text-green-400">✓</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 font-mono text-xs">
              <p>TCP Header: Seq=1000, Ack=2000, Window=65535</p>
            </div>
          </div>
        )
      case 3: // Network
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="bg-blue-500/20 border-2 border-blue-500 rounded-lg p-6 text-center flex-1">
                <Layers size={48} className="mx-auto mb-2" />
                <p className="font-bold">Source IP</p>
                <p className="text-sm font-mono">192.168.1.100</p>
              </div>
              <div className="text-4xl">🌐</div>
              <div className="bg-green-500/20 border-2 border-green-500 rounded-lg p-6 text-center flex-1">
                <Layers size={48} className="mx-auto mb-2" />
                <p className="font-bold">Dest IP</p>
                <p className="text-sm font-mono">93.184.216.34</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="font-bold mb-2">Routing Path</p>
              <div className="flex items-center justify-between text-sm">
                <span>Router 1</span>
                <span>→</span>
                <span>Router 2</span>
                <span>→</span>
                <span>Router 3</span>
                <span>→</span>
                <span>Destination</span>
              </div>
            </div>
          </div>
        )
      case 2: // Data Link
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="bg-purple-500/20 border-2 border-purple-500 rounded-lg p-6 text-center flex-1">
                <Wifi size={48} className="mx-auto mb-2" />
                <p className="font-bold">Source MAC</p>
                <p className="text-xs font-mono">AA:BB:CC:DD:EE:FF</p>
              </div>
              <div className="text-4xl">↔️</div>
              <div className="bg-pink-500/20 border-2 border-pink-500 rounded-lg p-6 text-center flex-1">
                <Wifi size={48} className="mx-auto mb-2" />
                <p className="font-bold">Dest MAC</p>
                <p className="text-xs font-mono">11:22:33:44:55:66</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <p className="font-bold mb-2">Frame Structure</p>
              <div className="flex gap-2 text-xs">
                <div className="bg-blue-500/20 p-2 rounded flex-1 text-center">Preamble</div>
                <div className="bg-green-500/20 p-2 rounded flex-1 text-center">Header</div>
                <div className="bg-yellow-500/20 p-2 rounded flex-1 text-center">Data</div>
                <div className="bg-red-500/20 p-2 rounded flex-1 text-center">CRC</div>
              </div>
            </div>
          </div>
        )
      case 1: // Physical
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-4">
              <div className="bg-red-500/20 border-2 border-red-500 rounded-lg p-6 text-center flex-1">
                <Radio size={48} className="mx-auto mb-2" />
                <p className="font-bold">Digital Signal</p>
                <p className="text-sm">Binary Data</p>
              </div>
              <div className="text-4xl">⚡</div>
              <div className="bg-yellow-500/20 border-2 border-yellow-500 rounded-lg p-6 text-center flex-1">
                <p className="font-bold">Physical Medium</p>
                <p className="text-sm">Copper/Fiber/Wireless</p>
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 font-mono text-center">
              <p className="text-2xl mb-2">Binary Transmission</p>
              <p className="text-green-400">1 0 1 1 0 0 1 0 1 1 1 0 0 1 0 1</p>
              <p className="text-sm text-gray-400 mt-2">Voltage: High/Low Signals</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-sm">
              <div className="bg-white/5 rounded p-2">
                <p className="font-bold">Ethernet</p>
                <p className="text-xs">Twisted Pair</p>
              </div>
              <div className="bg-white/5 rounded p-2">
                <p className="font-bold">Fiber Optic</p>
                <p className="text-xs">Light Pulses</p>
              </div>
              <div className="bg-white/5 rounded p-2">
                <p className="font-bold">Wireless</p>
                <p className="text-xs">Radio Waves</p>
              </div>
            </div>
          </div>
        )
      default:
        return <p>Simulation not available</p>
    }
  }

  const Icon = getLayerIcon(layer.id)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="professional-card rounded-2xl w-full max-w-6xl max-h-[95vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="p-6 border-b border-professional-accent-light/30 flex items-center justify-between sticky top-0 bg-professional-dark/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-4">
            <div 
              className="p-3 rounded-lg"
              style={{ backgroundColor: `${layer.color}20`, border: `2px solid ${layer.color}` }}
            >
              <Icon size={32} style={{ color: layer.color }} />
            </div>
            <div>
              <h2 className="text-3xl font-bold">{layer.name}</h2>
              <p className="text-blue-300 text-lg">{layer.protocol} - {layer.function}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-professional-accent/30 rounded-lg transition-all"
          >
            <X size={28} />
          </button>
        </div>
        
        <div className="p-8">
          {/* Layer Details */}
          <div className="bg-professional-accent/10 border border-professional-accent-light/20 rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Database size={24} />
              Layer Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-professional-accent/10 border border-professional-accent-light/20 rounded-lg p-4">
                <p className="text-sm text-gray-400">Layer Number</p>
                <p className="text-xl font-bold">Layer {layer.id}</p>
              </div>
              <div className="bg-professional-accent/10 border border-professional-accent-light/20 rounded-lg p-4">
                <p className="text-sm text-gray-400">Protocol</p>
                <p className="text-xl font-bold">{layer.protocol}</p>
              </div>
              <div className="bg-professional-accent/10 border border-professional-accent-light/20 rounded-lg p-4">
                <p className="text-sm text-gray-400">Function</p>
                <p className="text-lg">{layer.function}</p>
              </div>
              <div className="bg-professional-accent/10 border border-professional-accent-light/20 rounded-lg p-4">
                <p className="text-sm text-gray-400">Header Added</p>
                <p className="text-lg">{layer.headerAdded}</p>
              </div>
              <div className="bg-professional-accent/10 border border-professional-accent-light/20 rounded-lg p-4">
                <p className="text-sm text-gray-400">Header Size</p>
                <p className="text-xl font-bold text-yellow-400">{layer.headerSize} bytes</p>
              </div>
              <div className="bg-professional-accent/10 border border-professional-accent-light/20 rounded-lg p-4">
                <p className="text-sm text-gray-400">Color Code</p>
                <div className="flex items-center gap-2 mt-1">
                  <div 
                    className="w-8 h-8 rounded"
                    style={{ backgroundColor: layer.color }}
                  />
                  <p className="font-mono text-sm">{layer.color}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Simulation Canvas */}
          <div className="bg-professional-accent/10 border border-professional-accent-light/20 rounded-xl p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Network size={24} />
              Interactive Layer Simulation
            </h3>
            <div className="bg-professional-darker border border-professional-accent-light/10 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
              <div className="w-full">
                {getLayerVisualization(layer.id)}
              </div>
            </div>
            
            {/* Simulation Info */}
            <div className="mt-4 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
              <p className="text-sm text-blue-300">
                💡 <span className="font-semibold">Interactive Visualization:</span> This shows how {layer.name} processes and handles data in the OSI model.
              </p>
            </div>
          </div>

          {/* Detailed External Simulation (iFrame) */}
          <div className="bg-professional-accent/10 border border-professional-accent-light/20 rounded-xl p-6">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Globe size={24} />
              Detailed Simulation by Group {layer.id}
            </h3>
            <div className="bg-professional-darker border border-professional-accent-light/10 rounded-xl overflow-hidden">
              <iframe
                src={getIframeUrl(layer.id)}
                title={`${layer.name} Detailed Simulation`}
                className="w-full h-[600px] border-0"
                sandbox="allow-scripts allow-same-origin allow-forms"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
            
            {/* External Link Info */}
            <div className="mt-4 bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-purple-300">
                  🔗 <span className="font-semibold">External Simulation:</span> Detailed layer simulation provided by Group {layer.id}
                </p>
                <a
                  href={getIframeUrl(layer.id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 professional-button rounded-lg text-sm font-semibold flex items-center gap-2"
                >
                  Open in New Tab
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SimulationModal
