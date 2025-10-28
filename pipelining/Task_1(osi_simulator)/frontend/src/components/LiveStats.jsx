import { motion } from 'framer-motion'
import { Activity, Clock, Package, TrendingUp, Zap, Database } from 'lucide-react'
import { useEffect, useState } from 'react'

const LiveStats = ({ phase, currentLayer, packetData, startTime, darkMode = true }) => {
  const [elapsedTime, setElapsedTime] = useState(0)
  const [speed, setSpeed] = useState(0)

  useEffect(() => {
    if (phase !== 'idle' && phase !== 'complete') {
      const interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000
        setElapsedTime(elapsed)
        
        if (packetData) {
          const bytesProcessed = packetData.finalSize
          const currentSpeed = bytesProcessed / elapsed
          setSpeed(currentSpeed)
        }
      }, 100)

      return () => clearInterval(interval)
    }
  }, [phase, startTime, packetData])

  const getPhaseProgress = () => {
    if (phase === 'idle') return 0
    if (phase === 'complete') return 100
    if (phase === 'encapsulation') return ((7 - currentLayer + 1) / 7) * 33
    if (phase === 'transmission') return 33 + 33
    if (phase === 'decapsulation') return 66 + ((currentLayer) / 7) * 34
    return 0
  }

  const progress = getPhaseProgress()
  const efficiency = packetData ? ((packetData.originalSize / packetData.finalSize) * 100).toFixed(1) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl p-4 md:p-6 mb-6 md:mb-8 ${
        darkMode 
          ? 'professional-card' 
          : 'bg-white/80 border border-gray-200 shadow-lg'
      }`}
    >
      <h3 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
        <Activity size={24} className="text-green-400" />
        Live Statistics
      </h3>

      {/* Progress Bar */}
      <div className="mb-4 md:mb-6">
        <div className="flex justify-between text-xs md:text-sm mb-2">
          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Overall Progress</span>
          <span className="font-bold text-yellow-400">{progress.toFixed(0)}%</span>
        </div>
        <div className={`h-2 md:h-3 rounded-full overflow-hidden ${
          darkMode ? 'bg-white/10' : 'bg-gray-200'
        }`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Elapsed Time */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`rounded-lg p-3 md:p-4 border transition-all ${
            darkMode ? 'bg-professional-accent/10 border-professional-accent-light/30 hover:bg-professional-accent/20' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-1 md:mb-2">
            <Clock size={16} className="text-blue-400" />
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time</p>
          </div>
          <p className="text-xl md:text-2xl font-bold text-blue-400">
            {elapsedTime.toFixed(1)}s
          </p>
        </motion.div>

        {/* Current Layer */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`rounded-lg p-3 md:p-4 border ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-1 md:mb-2">
            <Package size={16} className="text-green-400" />
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Layer</p>
          </div>
          <p className="text-xl md:text-2xl font-bold text-green-400">
            {currentLayer > 0 ? `L${currentLayer}` : phase === 'transmission' ? '🌐' : '--'}
          </p>
        </motion.div>

        {/* Packet Size */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`rounded-lg p-3 md:p-4 border ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-1 md:mb-2">
            <Database size={16} className="text-yellow-400" />
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Size</p>
          </div>
          <p className="text-xl md:text-2xl font-bold text-yellow-400">
            {packetData ? packetData.finalSize : 0}B
          </p>
        </motion.div>

        {/* Speed */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`rounded-lg p-3 md:p-4 border ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-1 md:mb-2">
            <Zap size={16} className="text-purple-400" />
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Speed</p>
          </div>
          <p className="text-xl md:text-2xl font-bold text-purple-400">
            {speed > 0 ? speed.toFixed(0) : 0}
            <span className="text-xs ml-1">B/s</span>
          </p>
        </motion.div>

        {/* Overhead */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`rounded-lg p-3 md:p-4 border ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-1 md:mb-2">
            <TrendingUp size={16} className="text-red-400" />
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Overhead</p>
          </div>
          <p className="text-xl md:text-2xl font-bold text-red-400">
            {packetData ? packetData.overheadPercentage : 0}%
          </p>
        </motion.div>

        {/* Efficiency */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`rounded-lg p-3 md:p-4 border ${
            darkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
          }`}
        >
          <div className="flex items-center gap-2 mb-1 md:mb-2">
            <Activity size={16} className="text-cyan-400" />
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Efficiency</p>
          </div>
          <p className="text-xl md:text-2xl font-bold text-cyan-400">
            {efficiency}%
          </p>
        </motion.div>
      </div>

      {/* Phase Indicator */}
      <div className="mt-4 flex items-center justify-center gap-2 text-xs md:text-sm">
        <div className={`w-2 h-2 rounded-full ${phase !== 'idle' && phase !== 'complete' ? 'bg-green-400 animate-pulse' : 'bg-gray-600'}`} />
        <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          {phase === 'idle' && 'Ready to transmit'}
          {phase === 'encapsulation' && 'Encapsulating data...'}
          {phase === 'transmission' && 'Transmitting over medium...'}
          {phase === 'decapsulation' && 'Decapsulating data...'}
          {phase === 'complete' && 'Transmission complete!'}
        </span>
      </div>
    </motion.div>
  )
}

export default LiveStats
