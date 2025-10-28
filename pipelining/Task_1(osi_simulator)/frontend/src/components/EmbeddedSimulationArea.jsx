import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { ExternalLink, Maximize2, Minimize2 } from 'lucide-react'

const EmbeddedSimulationArea = ({ selectedLayer, message, onLayerChange }) => {
  const [isFullscreen, setIsFullscreen] = useState(false)

  if (!selectedLayer) {
    return (
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-12 text-center">
        <p className="text-xl text-gray-400">
          Select a layer to view its simulation
        </p>
      </div>
    )
  }

  const simulationUrl = selectedLayer.simulationUrl

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`backdrop-blur-md bg-white/10 border-2 rounded-2xl overflow-hidden ${
        isFullscreen ? 'fixed inset-4 z-40' : 'relative'
      }`}
      style={{ borderColor: selectedLayer.color }}
    >
      {/* Header */}
      <div
        className="p-4 border-b flex items-center justify-between"
        style={{ borderColor: `${selectedLayer.color}40` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full animate-pulse"
            style={{ backgroundColor: selectedLayer.color }}
          />
          <div>
            <h3 className="text-lg font-bold">{selectedLayer.name}</h3>
            <p className="text-xs text-gray-400">
              Group {selectedLayer.id} | {selectedLayer.protocol}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Layer Navigation */}
          <div className="flex items-center gap-1 mr-2">
            <button
              onClick={() => {
                const prevId = selectedLayer.id === 1 ? 7 : selectedLayer.id - 1
                onLayerChange(prevId)
              }}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
            >
              ← Prev
            </button>
            <button
              onClick={() => {
                const nextId = selectedLayer.id === 7 ? 1 : selectedLayer.id + 1
                onLayerChange(nextId)
              }}
              className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-sm transition-colors"
            >
              Next →
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>

          <a
            href={simulationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Open in new tab"
          >
            <ExternalLink size={18} />
          </a>
        </div>
      </div>

      {/* Message Context */}
      {message && (
        <div className="px-4 py-2 bg-white/5 border-b border-white/10">
          <p className="text-sm">
            <span className="text-gray-400">Processing:</span>{' '}
            <span className="font-mono text-yellow-400">"{message}"</span>
          </p>
        </div>
      )}

      {/* iFrame Container */}
      <div className={`relative ${isFullscreen ? 'h-[calc(100%-8rem)]' : 'h-[600px]'}`}>
        <iframe
          src={simulationUrl}
          title={`${selectedLayer.name} Simulation`}
          className="w-full h-full border-0"
          sandbox="allow-scripts allow-same-origin allow-forms"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-white/10 bg-white/5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">
            💡 Simulation provided by Group {selectedLayer.id}
          </span>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">
              Function: {selectedLayer.function}
            </span>
            <span className="font-mono bg-black/30 px-2 py-1 rounded">
              {selectedLayer.protocol}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default EmbeddedSimulationArea
