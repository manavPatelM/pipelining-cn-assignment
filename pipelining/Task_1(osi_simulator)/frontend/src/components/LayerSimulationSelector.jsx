import { motion } from 'framer-motion'
import { ExternalLink, Play } from 'lucide-react'

const LayerSimulationSelector = ({ layers, onSelectLayer, currentMessage }) => {
  return (
    <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6">
      <h3 className="text-2xl font-bold mb-4 text-center">
        🎮 Interactive Layer Simulations
      </h3>
      <p className="text-center text-gray-300 mb-6">
        Click any layer to explore its dedicated simulation (built by different groups)
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {layers.map((layer) => (
          <motion.button
            key={layer.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectLayer(layer)}
            className="relative overflow-hidden rounded-xl p-6 text-left transition-all duration-300 border-2"
            style={{
              backgroundColor: `${layer.color}10`,
              borderColor: layer.color,
            }}
          >
            {/* Background Gradient */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                background: `linear-gradient(135deg, ${layer.color}00 0%, ${layer.color}40 100%)`,
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-xs font-semibold text-gray-400 mb-1">
                    Layer {layer.id}
                  </div>
                  <h4 className="text-lg font-bold" style={{ color: layer.color }}>
                    {layer.name}
                  </h4>
                </div>
                <Play size={24} style={{ color: layer.color }} />
              </div>

              <p className="text-sm text-gray-300 mb-3">{layer.function}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs font-mono bg-black/30 px-2 py-1 rounded">
                  {layer.protocol}
                </span>
                <ExternalLink size={16} className="text-gray-400" />
              </div>

              {/* Group Badge */}
              <div className="mt-3 pt-3 border-t border-white/10">
                <span className="text-xs text-gray-400">
                  👥 Group {layer.id} Simulation
                </span>
              </div>
            </div>

            {/* Hover Effect */}
            <motion.div
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
              style={{
                background: `linear-gradient(135deg, ${layer.color}20 0%, ${layer.color}40 100%)`,
              }}
            />
          </motion.button>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-sm text-blue-300">
          💡 <span className="font-semibold">Collaborative Project:</span> Each layer simulation
          is built and maintained by a different group. Click any layer to explore their
          interactive demonstration.
        </p>
        {currentMessage && (
          <p className="text-sm text-gray-400 mt-2">
            Current message: <span className="font-mono text-yellow-400">"{currentMessage}"</span>
          </p>
        )}
      </div>
    </div>
  )
}

export default LayerSimulationSelector
