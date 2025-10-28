import { motion } from 'framer-motion'
import { ExternalLink, Loader, AlertCircle } from 'lucide-react'
import { useState } from 'react'

const LayerSimulationFrame = ({ layer, message, onClose }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  // Get simulation URL from layer data
  const simulationUrl = layer.simulationUrl

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
        className="bg-slate-900 border-2 rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col"
        style={{ borderColor: layer.color }}
      >
        {/* Header */}
        <div 
          className="p-4 border-b flex items-center justify-between"
          style={{ borderColor: `${layer.color}40` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-3 h-3 rounded-full animate-pulse"
              style={{ backgroundColor: layer.color }}
            />
            <div>
              <h2 className="text-xl font-bold">{layer.name} - Interactive Simulation</h2>
              <p className="text-sm text-gray-400">
                Group {layer.id} | Protocol: {layer.protocol}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href={simulationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Open in new tab"
            >
              <ExternalLink size={20} />
            </a>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Message Context Bar */}
        <div className="px-4 py-2 bg-white/5 border-b border-white/10">
          <p className="text-sm">
            <span className="text-gray-400">Processing message:</span>{' '}
            <span className="font-mono text-yellow-400">"{message}"</span>
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader size={48} className="animate-spin mx-auto mb-4" style={{ color: layer.color }} />
              <p className="text-lg font-semibold">Loading {layer.name} Simulation...</p>
              <p className="text-sm text-gray-400 mt-2">Group {layer.id}</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md">
              <AlertCircle size={48} className="mx-auto mb-4 text-red-400" />
              <p className="text-lg font-semibold mb-2">Failed to Load Simulation</p>
              <p className="text-sm text-gray-400 mb-4">
                The external simulation for {layer.name} could not be loaded.
              </p>
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <p className="text-xs text-gray-500 font-mono break-all">
                  {simulationUrl}
                </p>
              </div>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => {
                    setHasError(false)
                    setIsLoading(true)
                  }}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
                >
                  Retry
                </button>
                <a
                  href={simulationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                >
                  Open in New Tab
                </a>
              </div>
            </div>
          </div>
        )}

        {/* iFrame */}
        <iframe
          src={simulationUrl}
          title={`${layer.name} Simulation`}
          className={`flex-1 w-full border-0 ${isLoading || hasError ? 'hidden' : ''}`}
          onLoad={handleLoad}
          onError={handleError}
          sandbox="allow-scripts allow-same-origin allow-forms"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />

        {/* Footer */}
        <div className="p-3 border-t border-white/10 bg-white/5">
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>
              💡 This simulation is provided by Group {layer.id}
            </span>
            <span>
              Press ESC or click outside to close
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default LayerSimulationFrame
