import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, WifiOff, XCircle, Clock, Shield, Server, Globe } from 'lucide-react'

const ErrorSimulation = ({ layer, onResolve }) => {
  const errorScenarios = {
    1: {
      icon: WifiOff,
      title: "Physical Layer Error",
      error: "Signal Interference Detected",
      description: "Electromagnetic interference is corrupting the signal",
      solution: "Retransmitting with error correction...",
      color: "#ec4899"
    },
    2: {
      icon: XCircle,
      title: "Data Link Layer Error",
      error: "Frame Collision / CRC Error",
      description: "Frame checksum mismatch detected",
      solution: "Requesting frame retransmission...",
      color: "#8b5cf6"
    },
    3: {
      icon: AlertTriangle,
      title: "Network Layer Error",
      error: "Packet Loss / Routing Error",
      description: "Packet dropped due to network congestion",
      solution: "Rerouting through alternate path...",
      color: "#3b82f6"
    },
    4: {
      icon: Clock,
      title: "Transport Layer Error",
      error: "Connection Timeout",
      description: "TCP acknowledgment not received",
      solution: "Retransmitting segment...",
      color: "#22c55e"
    },
    5: {
      icon: Clock,
      title: "Session Layer Error",
      error: "Session Timeout",
      description: "Session expired due to inactivity",
      solution: "Re-establishing session...",
      color: "#eab308"
    },
    6: {
      icon: Shield,
      title: "Presentation Layer Error",
      error: "Decryption Failure",
      description: "Invalid encryption key or corrupted data",
      solution: "Requesting secure key exchange...",
      color: "#f97316"
    },
    7: {
      icon: Server,
      title: "Application Layer Error",
      error: "HTTP 500 - Server Error",
      description: "Remote server encountered an error",
      solution: "Retrying request...",
      color: "#ef4444"
    }
  }

  const error = errorScenarios[layer]
  if (!error) return null

  const Icon = error.icon

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ y: 50 }}
        animate={{ y: 0 }}
        className="professional-card border-2 border-red-500 rounded-2xl p-8 max-w-md w-full shadow-professional-lg"
      >
        {/* Error Icon */}
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, repeat: 2 }}
          className="flex justify-center mb-4"
        >
          <div 
            className="p-4 rounded-full"
            style={{ backgroundColor: `${error.color}20`, border: `3px solid ${error.color}` }}
          >
            <Icon size={48} style={{ color: error.color }} />
          </div>
        </motion.div>

        {/* Error Details */}
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold mb-2" style={{ color: error.color }}>
            {error.title}
          </h3>
          <p className="text-xl font-semibold text-red-400 mb-3">
            ⚠️ {error.error}
          </p>
          <p className="text-gray-400 mb-4">
            {error.description}
          </p>
          
          {/* Recovery Animation */}
          <div className="bg-professional-accent/10 border border-professional-accent-light/20 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-400 mb-2">🔄 {error.solution}</p>
            <div className="h-2 bg-professional-darker rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 2 }}
                className="h-full bg-gradient-to-r from-yellow-500 to-green-500"
              />
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={onResolve}
          className="w-full py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold transition-colors"
        >
          ✓ Error Resolved - Continue
        </button>

        {/* Error Code */}
        <p className="text-center text-xs text-gray-500 mt-4 font-mono">
          ERROR_CODE: L{layer}_TRANSMISSION_FAILURE
        </p>
      </motion.div>
    </motion.div>
  )
}

export default ErrorSimulation
