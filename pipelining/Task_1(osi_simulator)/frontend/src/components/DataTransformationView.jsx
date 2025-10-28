import { motion } from 'framer-motion'
import { Code, ArrowRight } from 'lucide-react'

const DataTransformationView = ({ message, currentLayer, phase }) => {
  const textToHex = (text) => {
    return text.split('').map(char => 
      char.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase()
    ).join(' ')
  }

  const getHeaderHex = (layerId) => {
    const headers = {
      7: 'HTTP/1.1 200 OK',
      6: 'TLS 1.3 [ENCRYPTED]',
      5: 'SESSION ID: A1B2C3',
      4: 'TCP [SYN=1 ACK=1]',
      3: 'IP [SRC=192.168.1.1]',
      2: 'MAC [AA:BB:CC:DD:EE:FF]',
      1: 'BITS [10110010...]'
    }
    return headers[layerId] || ''
  }

  const getTransformation = () => {
    if (!message || currentLayer === null) return null

    const transformations = []
    
    // Show headers added up to current layer
    if (phase === 'encapsulation') {
      for (let i = 7; i >= currentLayer; i--) {
        transformations.push({
          layer: i,
          header: getHeaderHex(i),
          color: getLayerColor(i)
        })
      }
    } else if (phase === 'decapsulation') {
      for (let i = currentLayer; i <= 7; i++) {
        transformations.push({
          layer: i,
          header: getHeaderHex(i),
          color: getLayerColor(i)
        })
      }
    }

    return transformations
  }

  const getLayerColor = (layerId) => {
    const colors = {
      7: '#ef4444',
      6: '#f97316',
      5: '#eab308',
      4: '#22c55e',
      3: '#3b82f6',
      2: '#8b5cf6',
      1: '#ec4899'
    }
    return colors[layerId]
  }

  const transformations = getTransformation()

  if (!transformations || transformations.length === 0) {
    return (
      <div className="professional-card rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Code size={24} className="text-blue-400" />
          <h3 className="text-xl font-bold">Data Transformation</h3>
        </div>
        <p className="text-center text-gray-400 py-8">
          Start simulation to see data transformation
        </p>
      </div>
    )
  }

  return (
    <div className="professional-card rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <Code size={24} className="text-blue-400" />
        <h3 className="text-xl font-bold">Data Transformation at Layer {currentLayer}</h3>
      </div>

      {/* Before State */}
      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Original Data (ASCII):</p>
        <div className="bg-professional-darker border border-professional-accent-light/20 rounded-lg p-4 font-mono">
          <p className="text-yellow-400 break-all">{message}</p>
        </div>
      </div>

      <div className="flex items-center justify-center my-4">
        <ArrowRight size={32} className="text-blue-400" />
      </div>

      {/* After State with Headers */}
      <div>
        <p className="text-sm text-gray-400 mb-2">
          {phase === 'encapsulation' ? 'After Encapsulation:' : 'After Decapsulation:'}
        </p>
        
        <div className="space-y-2">
          {transformations.map((t, index) => (
            <motion.div
              key={t.layer}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-professional-darker border border-professional-accent-light/20 rounded-lg p-3 border-l-4"
              style={{ borderColor: t.color }}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold" style={{ color: t.color }}>
                  Layer {t.layer} Header
                </span>
                <span className="text-xs text-gray-500">
                  {t.header.length} bytes
                </span>
              </div>
              <p className="font-mono text-xs text-gray-300 break-all">
                {t.header}
              </p>
            </motion.div>
          ))}
          
          {/* Original Data */}
          <div className="bg-yellow-500/10 rounded-lg p-3 border-l-4 border-yellow-400">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-yellow-400">
                Payload (Original Data)
              </span>
              <span className="text-xs text-gray-500">
                {message.length} bytes
              </span>
            </div>
            <p className="font-mono text-xs text-yellow-400 break-all">
              {message}
            </p>
          </div>
        </div>
      </div>

      {/* Hexadecimal View */}
      <div className="mt-4 bg-professional-darker border border-professional-accent-light/20 rounded-lg p-4">
        <p className="text-xs text-gray-400 mb-2">Hexadecimal Representation:</p>
        <p className="font-mono text-xs text-green-400 break-all">
          {textToHex(message)}
        </p>
      </div>

      {/* Size Comparison */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-professional-accent/10 border border-professional-accent-light/20 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400">Original Size</p>
          <p className="text-2xl font-bold text-blue-400">{message.length}B</p>
        </div>
        <div className="bg-professional-accent/10 border border-professional-accent-light/20 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400">Current Size</p>
          <p className="text-2xl font-bold text-green-400">
            {message.length + (transformations.length * 20)}B
          </p>
        </div>
      </div>
    </div>
  )
}

export default DataTransformationView
