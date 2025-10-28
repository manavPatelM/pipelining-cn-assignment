import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Radio, Zap, Activity } from 'lucide-react'

const BinaryVisualization = ({ message, isActive }) => {
  const [binaryData, setBinaryData] = useState([])
  const [currentBit, setCurrentBit] = useState(0)

  useEffect(() => {
    if (message) {
      // Convert message to binary
      const binary = message
        .split('')
        .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join(' ')
      setBinaryData(binary.split(''))
    }
  }, [message])

  useEffect(() => {
    if (isActive && binaryData.length > 0) {
      const interval = setInterval(() => {
        setCurrentBit(prev => (prev + 1) % binaryData.length)
      }, 100)
      return () => clearInterval(interval)
    }
  }, [isActive, binaryData])

  const getSignalValue = (bit) => {
    if (bit === '1') return 1
    if (bit === '0') return -1
    return 0 // space
  }

  return (
    <div className="professional-card rounded-xl p-6 border-2 border-pink-500/40">
      <div className="flex items-center gap-2 mb-4">
        <Radio size={24} className="text-pink-400" />
        <h3 className="text-xl font-bold">Physical Layer - Binary Transmission</h3>
      </div>

      {/* Binary Stream */}
      <div className="bg-professional-darker border border-professional-accent-light/20 rounded-lg p-4 mb-4 font-mono text-center overflow-x-auto">
        <p className="text-xs text-gray-400 mb-2">Binary Representation</p>
        <div className="flex flex-wrap justify-center gap-1">
          {binaryData.map((bit, index) => (
            <motion.span
              key={index}
              animate={{
                color: index === currentBit && isActive ? '#ec4899' : bit === '1' ? '#22c55e' : bit === '0' ? '#3b82f6' : '#666',
                scale: index === currentBit && isActive ? 1.3 : 1
              }}
              className="text-lg font-bold"
            >
              {bit}
            </motion.span>
          ))}
        </div>
      </div>

      {/* Signal Waveform */}
      <div className="bg-professional-darker border border-professional-accent-light/20 rounded-lg p-4 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity size={18} className="text-yellow-400" />
          <p className="text-xs text-gray-400">Digital Signal Waveform</p>
        </div>
        <div className="relative h-24 bg-slate-800 rounded">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            <div className="border-t border-gray-700" />
            <div className="border-t border-gray-600" />
            <div className="border-t border-gray-700" />
          </div>
          
          {/* Waveform */}
          <svg className="w-full h-full" viewBox="0 0 400 100" preserveAspectRatio="none">
            <motion.path
              d={binaryData.slice(0, 40).map((bit, i) => {
                const x = i * 10
                const y = getSignalValue(bit) === 1 ? 20 : getSignalValue(bit) === -1 ? 80 : 50
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`
              }).join(' ')}
              stroke="#ec4899"
              strokeWidth="2"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isActive ? 1 : 0 }}
              transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
            />
          </svg>
          
          {/* Labels */}
          <div className="absolute left-2 top-2 text-xs text-green-400">HIGH (1)</div>
          <div className="absolute left-2 bottom-2 text-xs text-blue-400">LOW (0)</div>
        </div>
      </div>

      {/* Transmission Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-professional-accent/10 border border-professional-accent-light/20 rounded-lg p-3 text-center">
          <Zap size={18} className="mx-auto mb-1 text-yellow-400" />
          <p className="text-xs text-gray-400">Bit Rate</p>
          <p className="text-lg font-bold text-yellow-400">
            {isActive ? '1 Gbps' : '0 bps'}
          </p>
        </div>
        <div className="bg-professional-accent/10 border border-professional-accent-light/20 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Total Bits</p>
          <p className="text-lg font-bold text-blue-400">
            {binaryData.filter(b => b !== ' ').length}
          </p>
        </div>
        <div className="bg-professional-accent/10 border border-professional-accent-light/20 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-400 mb-1">Encoding</p>
          <p className="text-sm font-bold text-green-400">
            Manchester
          </p>
        </div>
      </div>

      {/* Transmission Medium */}
      <div className="mt-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 rounded-lg p-3">
        <p className="text-sm text-center">
          <span className="font-semibold text-pink-400">Medium:</span> Copper Wire (Cat6 Ethernet)
        </p>
        <p className="text-xs text-center text-gray-400 mt-1">
          Electrical signals traveling at ~2/3 speed of light
        </p>
      </div>
    </div>
  )
}

export default BinaryVisualization
