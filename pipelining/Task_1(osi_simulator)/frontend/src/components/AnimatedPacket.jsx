import { motion, AnimatePresence } from 'framer-motion'

const AnimatedPacket = ({ packetData, currentLayer, phase, darkMode = true }) => {
  if (!packetData) return null

  const getHeadersForLayer = (layerId) => {
    const headers = []
    
    // Add headers based on current layer during encapsulation
    if (phase === 'encapsulation') {
      if (layerId <= 7) headers.push({ name: 'HTTP Header', color: '#ef4444', size: 0 })
      if (layerId <= 6) headers.push({ name: 'SSL/TLS Encryption', color: '#f97316', size: 100 })
      if (layerId <= 5) headers.push({ name: 'Session ID', color: '#eab308', size: 50 })
      if (layerId <= 4) headers.push({ name: 'TCP Header', color: '#22c55e', size: 20 })
      if (layerId <= 3) headers.push({ name: 'IP Header', color: '#3b82f6', size: 20 })
      if (layerId <= 2) headers.push({ name: 'MAC Header', color: '#8b5cf6', size: 18 })
    } else if (phase === 'decapsulation') {
      // Remove headers as we go up
      if (currentLayer <= 2) headers.push({ name: 'MAC Header', color: '#8b5cf6', size: 18 })
      if (currentLayer <= 3) headers.push({ name: 'IP Header', color: '#3b82f6', size: 20 })
      if (currentLayer <= 4) headers.push({ name: 'TCP Header', color: '#22c55e', size: 20 })
      if (currentLayer <= 5) headers.push({ name: 'Session ID', color: '#eab308', size: 50 })
      if (currentLayer <= 6) headers.push({ name: 'SSL/TLS Encryption', color: '#f97316', size: 100 })
      if (currentLayer <= 7) headers.push({ name: 'HTTP Header', color: '#ef4444', size: 0 })
    }
    
    return headers
  }

  const headers = getHeadersForLayer(currentLayer)
  const totalSize = headers.reduce((sum, h) => sum + h.size, 0) + packetData.originalSize

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Packet Visualization */}
      <div className="relative">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative"
        >
          {/* Headers Stack */}
          <AnimatePresence mode="sync">
            {headers.map((header, index) => (
              <motion.div
                key={header.name}
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.8 }}
                transition={{ 
                  duration: 0.5,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                className="border-2 rounded-lg p-3 mb-2 backdrop-blur-sm"
                style={{ 
                  borderColor: header.color,
                  backgroundColor: `${header.color}20`,
                  boxShadow: `0 0 15px ${header.color}40`
                }}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-bold" style={{ color: header.color }}>
                    {header.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {header.size > 0 ? `+${header.size}B` : 'Protocol'}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Original Data (Core) */}
          <motion.div
            layout
            className="border-2 border-yellow-400 rounded-lg p-4 bg-yellow-400/20 backdrop-blur-sm"
            style={{ boxShadow: '0 0 20px rgba(250, 204, 21, 0.4)' }}
          >
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Original Data</p>
              <p className="font-mono font-bold text-yellow-400 break-all">
                "{packetData.message}"
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {packetData.originalSize} bytes
              </p>
            </div>
          </motion.div>

          {/* MAC Trailer (only at layer 2) */}
          {phase === 'encapsulation' && currentLayer <= 2 && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="border-2 border-purple-500 rounded-lg p-2 mt-2 backdrop-blur-sm"
              style={{ 
                borderColor: '#8b5cf6',
                backgroundColor: '#8b5cf620',
                boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-purple-400">MAC Trailer (CRC)</span>
                <span className="text-xs text-gray-400">+8B</span>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Size Indicator */}
      <motion.div
        key={totalSize}
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className={`rounded-full px-4 md:px-6 py-2 border ${
          darkMode ? 'bg-white/10 border-white/20' : 'bg-gray-100 border-gray-300'
        }`}
      >
        <p className="text-center">
          <span className="text-xl md:text-2xl font-bold text-yellow-400">{totalSize}</span>
          <span className={`text-xs md:text-sm ml-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            bytes
          </span>
        </p>
      </motion.div>

      {/* Header Count */}
      <div className={`flex items-center gap-2 text-xs md:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <span className={`px-3 py-1 rounded-full ${darkMode ? 'bg-white/5' : 'bg-gray-100'}`}>
          {headers.length} {headers.length === 1 ? 'Header' : 'Headers'}
        </span>
        {phase === 'encapsulation' && (
          <span className="text-green-400">+ Adding</span>
        )}
        {phase === 'decapsulation' && (
          <span className="text-red-400">- Removing</span>
        )}
      </div>

      {/* Layer Info */}
      {currentLayer > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-lg p-3 text-center max-w-md ${
            darkMode 
              ? 'bg-blue-500/10 border border-blue-500/30' 
              : 'bg-blue-50 border border-blue-200'
          }`}
        >
          <p className={`text-xs md:text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
            {phase === 'encapsulation' 
              ? `📦 Wrapping data with Layer ${currentLayer} header...`
              : `📭 Unwrapping Layer ${currentLayer} header...`
            }
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default AnimatedPacket
