import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, ArrowDown, ArrowRight, ArrowUp, AlertCircle, Moon, Sun, Info } from 'lucide-react'

// Core Components
import LayerCard from './components/LayerCard'
import AnimatedPacket from './components/AnimatedPacket'
import SimulationModal from './components/SimulationModal'

// Feature Components
import LiveStats from './components/LiveStats'
import DataTransformationView from './components/DataTransformationView'
import ErrorSimulation from './components/ErrorSimulation'
import BinaryVisualization from './components/BinaryVisualization'

// Services & Hooks
import { apiService } from './services/api'
import { useSimulation } from './hooks/useSimulation'
import { SIMULATION_PHASES, ANIMATION_SPEEDS, APP_NAME, APP_VERSION } from './config/constants'

function App() {
  const [message, setMessage] = useState('Hello, World!')
  const [layers, setLayers] = useState([])
  const [packetData, setPacketData] = useState(null)
  const [selectedLayer, setSelectedLayer] = useState(null)
  const [transmissionTime, setTransmissionTime] = useState(0)
  const [darkMode, setDarkMode] = useState(true)
  const [showInfo, setShowInfo] = useState(false)

  // Enhanced features state
  const [errorSimulationEnabled, setErrorSimulationEnabled] = useState(false)
  const [currentError, setCurrentError] = useState(null)
  const [showBinaryView, setShowBinaryView] = useState(false)
  
  // Use custom simulation hook
  const simulation = useSimulation()

  useEffect(() => {
    apiService.getLayers()
      .then(data => setLayers(data.layers))
      .catch(err => console.error('Failed to fetch layers:', err))
  }, [])

  const handlePause = () => {
    simulation.setIsPaused(true)
  }

  const handleResume = () => {
    simulation.setIsPaused(false)
  }

  const handleSpeedChange = (newSpeed) => {
    simulation.setSpeed(newSpeed)
  }

  const simulateError = async (layerId) => {
    if (errorSimulationEnabled && Math.random() < 0.25) {
      setCurrentError(layerId)
      await new Promise(resolve => {
        const handleResolve = () => {
          setCurrentError(null)
          resolve()
        }
        window.errorResolveCallback = handleResolve
      })
    }
  }

  const startSimulation = async () => {
    if (!message || message.length > 100) return

    simulation.setPhase(SIMULATION_PHASES.ENCAPSULATION)
    simulation.setCurrentLayer(7)
    simulation.setStartTime(Date.now())
    simulation.setIsPaused(false)

    try {
      const data = await apiService.transmitMessage(message)
      setPacketData(data)

      // Encapsulation phase (Layer 7 → 1)
      for (let i = 7; i >= 1; i--) {
        simulation.setCurrentLayer(i)
        await simulateError(i)
        await simulation.wait(1200)
      }

      // Show binary visualization at physical layer
      if (showBinaryView) {
        await simulation.wait(2000)
      }

      // Transmission phase
      simulation.setPhase(SIMULATION_PHASES.TRANSMISSION)
      simulation.setCurrentLayer(0)
      await simulation.wait(2000)

      // Decapsulation phase (Layer 1 → 7)
      simulation.setPhase(SIMULATION_PHASES.DECAPSULATION)
      for (let i = 1; i <= 7; i++) {
        simulation.setCurrentLayer(i)
        await simulateError(i)
        await simulation.wait(1200)
      }

      simulation.setPhase(SIMULATION_PHASES.COMPLETE)
      setTransmissionTime(data.estimatedTime)
    } catch (error) {
      console.error('Simulation failed:', error)
      simulation.setPhase(SIMULATION_PHASES.ERROR)
      setTimeout(() => simulation.reset(), 3000)
    }
  }

  const resetSimulation = () => {
    simulation.reset()
    setPacketData(null)
    setTransmissionTime(0)
    setCurrentError(null)
  }

  const getPhaseLabel = () => {
    switch (simulation.phase) {
      case SIMULATION_PHASES.ENCAPSULATION: return '📤 Encapsulation (Sender)'
      case SIMULATION_PHASES.TRANSMISSION: return '🌐 Transmission (Medium)'
      case SIMULATION_PHASES.DECAPSULATION: return '📥 Decapsulation (Receiver)'
      case SIMULATION_PHASES.COMPLETE: return '✅ Message Delivered Successfully!'
      case SIMULATION_PHASES.ERROR: return '❌ Simulation Error'
      default: return '⏸️ Ready to Transmit'
    }
  }

  const isLayerActive = (layerId) => {
    if (simulation.phase === SIMULATION_PHASES.ENCAPSULATION && simulation.currentLayer >= layerId) return true
    if (simulation.phase === SIMULATION_PHASES.DECAPSULATION && simulation.currentLayer >= layerId) return true
    if (simulation.phase === SIMULATION_PHASES.COMPLETE) return true
    return false
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode 
        ? 'bg-black text-white' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-900'
    } p-4 md:p-8`}>
      <div className="max-w-7xl mx-auto">
        {/* Header with Theme Toggle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6 md:mb-8 relative"
        >
          <div className="absolute top-0 right-0 flex gap-2">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className={`p-2 rounded-lg transition-all ${
                darkMode ? 'glass-effect hover:bg-professional-accent/30' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              title="About"
            >
              <Info size={20} />
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all ${
                darkMode ? 'glass-effect hover:bg-professional-accent/30' : 'bg-gray-200 hover:bg-gray-300'
              }`}
              title="Toggle theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
            🌐 {APP_NAME}
          </h1>
          <p className={`text-base md:text-xl ${darkMode ? 'text-blue-400' : 'text-gray-600'}`}>
            Interactive Data Flow Visualization (Sender ↔ Receiver)
          </p>
          <p className={`text-xs md:text-sm mt-1 ${darkMode ? 'text-blue-500' : 'text-gray-500'}`}>
            Version {APP_VERSION}
          </p>
        </motion.div>

        {/* Info Modal */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowInfo(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className={`max-w-2xl w-full rounded-2xl p-6 ${
                  darkMode ? 'professional-card text-white' : 'bg-white text-gray-900'
                } shadow-2xl`}
              >
                <h2 className="text-2xl font-bold mb-4">About OSI Layer Simulator</h2>
                <div className="space-y-3 text-sm">
                  <p>
                    This professional simulator demonstrates how data flows through the 7 layers of the OSI model,
                    from application to physical layer and back.
                  </p>
                  <div>
                    <h3 className="font-semibold mb-2">Features:</h3>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>Real-time visualization of encapsulation and decapsulation</li>
                      <li>Interactive layer details and protocol information</li>
                      <li>Error simulation for network troubleshooting practice</li>
                      <li>Binary visualization at the physical layer</li>
                      <li>Adjustable simulation speed and pause/resume controls</li>
                      <li>Live statistics and data transformation tracking</li>
                      <li>Dark/Light theme support</li>
                    </ul>
                  </div>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Built with React, Framer Motion, and Tailwind CSS
                  </p>
                </div>
                <button
                  onClick={() => setShowInfo(false)}
                  className="mt-6 w-full py-2 professional-button rounded-lg font-semibold"
                >
                  Close
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Statistics Dashboard */}
        {simulation.phase !== SIMULATION_PHASES.IDLE && (
          <LiveStats
            phase={simulation.phase}
            currentLayer={simulation.currentLayer}
            packetData={packetData}
            startTime={simulation.startTime}
            darkMode={darkMode}
          />
        )}

        {/* Input Section with Enhanced Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`rounded-2xl p-4 md:p-6 mb-6 md:mb-8 ${
            darkMode 
              ? 'professional-card' 
              : 'bg-white/80 border border-gray-200 shadow-lg'
          }`}
        >
          <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium mb-2">Enter Message</label>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={100}
                disabled={simulation.phase !== SIMULATION_PHASES.IDLE}
                className={`w-full px-4 py-3 rounded-lg border focus:outline-none disabled:opacity-50 transition-all ${
                  darkMode
                    ? 'bg-professional-accent/20 border-professional-accent-light/40 focus:border-professional-accent-light focus:ring-2 focus:ring-professional-accent-light/30 text-black placeholder-gray-400'
                    : 'bg-white border-gray-300 focus:border-blue-500 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Type your message..."
              />
              <p className={`text-sm mt-1 ${darkMode ? 'text-blue-400' : 'text-black-600'}`}>
                {message.length}/100 characters
              </p>
            </div>
            <button
              onClick={startSimulation}
              disabled={simulation.phase !== SIMULATION_PHASES.IDLE || !message}
              className="w-full md:w-auto px-6 py-3 professional-button disabled:bg-gray-500 disabled:cursor-not-allowed disabled:shadow-none rounded-lg font-semibold flex items-center justify-center gap-2"
            >
              <Send size={20} />
              Send Message
            </button>
          </div>

          {/* Simulation Control Options */}
          <div className={`border-t pt-4 mt-4 ${darkMode ? 'border-professional-accent-light/20' : 'border-gray-200'}`}>
            <h4 className={`text-sm font-semibold mb-3 ${darkMode ? 'text-blue-400' : 'text-gray-700'}`}>
              🎛️ Simulation Controls
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <label className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg transition-all ${
                darkMode ? 'bg-professional-accent/10 hover:bg-professional-accent/20 border border-professional-accent-light/20' : 'bg-gray-50 hover:bg-gray-100'
              }`}>
                <input
                  type="checkbox"
                  checked={errorSimulationEnabled}
                  onChange={(e) => setErrorSimulationEnabled(e.target.checked)}
                  disabled={simulation.phase !== SIMULATION_PHASES.IDLE}
                  className="w-4 h-4 accent-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-yellow-400" />
                    <span className="text-sm font-medium">Enable Error Simulation</span>
                  </div>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    Simulate network errors at random layers
                  </p>
                </div>
              </label>

              <label className={`flex items-center gap-2 cursor-pointer p-3 rounded-lg transition-all ${
                darkMode ? 'bg-professional-accent/10 hover:bg-professional-accent/20 border border-professional-accent-light/20' : 'bg-gray-50 hover:bg-gray-100'
              }`}>
                <input
                  type="checkbox"
                  checked={showBinaryView}
                  onChange={(e) => setShowBinaryView(e.target.checked)}
                  disabled={simulation.phase !== SIMULATION_PHASES.IDLE}
                  className="w-4 h-4 accent-blue-500"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Show Binary Visualization</span>
                  </div>
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Display binary data at physical layer
                  </p>
                </div>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Simulation Controls */}
        {simulation.phase !== SIMULATION_PHASES.IDLE && simulation.phase !== SIMULATION_PHASES.COMPLETE && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`rounded-2xl p-4 md:p-6 mb-6 md:mb-8 ${
              darkMode 
                ? 'professional-card' 
                : 'bg-white/80 border border-gray-200 shadow-lg'
            }`}
          >
            <h3 className="text-base md:text-lg font-bold mb-4 text-center">Simulation Controls</h3>
            <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
              {/* Pause/Resume Button */}
              {!simulation.isPaused ? (
                <button
                  onClick={handlePause}
                  className="px-4 md:px-6 py-2 md:py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-md text-sm md:text-base"
                >
                  ⏸ Pause
                </button>
              ) : (
                <button
                  onClick={handleResume}
                  className="px-4 md:px-6 py-2 md:py-3 bg-green-500 hover:bg-green-600 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-md text-sm md:text-base"
                >
                  ▶ Resume
                </button>
              )}

              {/* Speed Control */}
              <div className="flex items-center gap-2">
                <span className={`text-xs md:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  Speed:
                </span>
                {[0.5, 1, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-semibold transition-all ${
                      simulation.speed === s
                        ? 'professional-button text-white'
                        : darkMode 
                          ? 'bg-professional-accent/20 hover:bg-professional-accent/30 border border-professional-accent-light/30' 
                          : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Reset Button */}
              <button
                onClick={resetSimulation}
                className="px-4 md:px-6 py-2 md:py-3 bg-red-500 hover:bg-red-600 rounded-lg font-semibold flex items-center gap-2 transition-colors shadow-md text-sm md:text-base"
              >
                🔄 Reset
              </button>
            </div>

            {/* Current Status */}
            <div className="mt-4 text-center">
              <p className={`text-xs md:text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Status: {simulation.isPaused ? '⏸ Paused' : '▶ Running'} | Speed: {simulation.speed}x | Phase: {getPhaseLabel()}
              </p>
            </div>
          </motion.div>
        )}

        {/* Phase Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mb-6 md:mb-8"
        >
          <div className={`inline-block rounded-full px-4 md:px-8 py-2 md:py-3 ${
            darkMode 
              ? 'professional-card' 
              : 'bg-white/80 border border-gray-200 shadow-lg'
          }`}>
            <p className="text-lg md:text-2xl font-bold">{getPhaseLabel()}</p>
          </div>
        </motion.div>

        {/* Main Simulation Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-8">
          {/* Sender Side */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-center">📤 SENDER</h2>
            <div className="space-y-2 md:space-y-3">
              {layers.map((layer) => (
                <LayerCard
                  key={`sender-${layer.id}`}
                  layer={layer}
                  isActive={simulation.phase === SIMULATION_PHASES.ENCAPSULATION && simulation.currentLayer === layer.id}
                  isCompleted={isLayerActive(layer.id) && simulation.phase !== SIMULATION_PHASES.ENCAPSULATION}
                  onClick={() => setSelectedLayer(layer)}
                  darkMode={darkMode}
                />
              ))}
            </div>
            {simulation.phase === SIMULATION_PHASES.ENCAPSULATION && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mt-4"
              >
                <ArrowDown size={32} className="text-yellow-400 animate-bounce" />
              </motion.div>
            )}
          </div>

          {/* Transmission Medium */}
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">🌐 TRANSMISSION</h2>
            <div className={`rounded-2xl p-4 md:p-8 w-full ${
              darkMode 
                ? 'professional-card' 
                : 'bg-white/80 border border-gray-200 shadow-lg'
            }`}>
              {simulation.phase === SIMULATION_PHASES.TRANSMISSION && (
                <motion.div
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-6xl mb-4">📡</div>
                  <p className="text-sm md:text-lg font-mono break-all">
                    {Array.from({ length: 20 }, () => Math.random() > 0.5 ? '1' : '0').join('')}
                  </p>
                  <p className={`text-xs md:text-sm mt-2 ${darkMode ? 'text-blue-200' : 'text-gray-600'}`}>
                    Transmitting bits...
                  </p>
                </motion.div>
              )}
              {simulation.phase === SIMULATION_PHASES.IDLE && (
                <div className={`text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p className="text-sm md:text-base">Waiting for transmission...</p>
                </div>
              )}
              {(simulation.phase === SIMULATION_PHASES.ENCAPSULATION || 
                simulation.phase === SIMULATION_PHASES.DECAPSULATION || 
                simulation.phase === SIMULATION_PHASES.COMPLETE) && (
                <AnimatedPacket 
                  packetData={packetData} 
                  currentLayer={simulation.currentLayer} 
                  phase={simulation.phase}
                  darkMode={darkMode}
                />
              )}
            </div>
            {simulation.phase === SIMULATION_PHASES.TRANSMISSION && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <ArrowRight size={32} className="text-green-400 animate-pulse" />
              </motion.div>
            )}
          </div>

          {/* Receiver Side */}
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-center">📥 RECEIVER</h2>
            {simulation.phase === SIMULATION_PHASES.DECAPSULATION && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center mb-4"
              >
                <ArrowUp size={32} className="text-green-400 animate-bounce" />
              </motion.div>
            )}
            <div className="space-y-2 md:space-y-3">
              {layers.map((layer) => (
                <LayerCard
                  key={`receiver-${layer.id}`}
                  layer={layer}
                  isActive={simulation.phase === SIMULATION_PHASES.DECAPSULATION && simulation.currentLayer === layer.id}
                  isCompleted={simulation.phase === SIMULATION_PHASES.DECAPSULATION && simulation.currentLayer > layer.id}
                  onClick={() => setSelectedLayer(layer)}
                  darkMode={darkMode}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Data Transformation View */}
        {simulation.phase !== SIMULATION_PHASES.IDLE && simulation.phase !== SIMULATION_PHASES.COMPLETE && (
          <div className="mb-6 md:mb-8">
            <DataTransformationView
              message={message}
              currentLayer={simulation.currentLayer || 1}
              phase={simulation.phase}
              darkMode={darkMode}
            />
          </div>
        )}

        {/* Binary Visualization at Physical Layer */}
        {showBinaryView && simulation.currentLayer === 1 && simulation.phase !== SIMULATION_PHASES.IDLE && (
          <div className="mb-6 md:mb-8">
            <BinaryVisualization
              message={message}
              isActive={simulation.phase === SIMULATION_PHASES.ENCAPSULATION || simulation.phase === SIMULATION_PHASES.TRANSMISSION}
              darkMode={darkMode}
            />
          </div>
        )}



        {/* Result Display */}
        {simulation.phase === SIMULATION_PHASES.COMPLETE && packetData && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`rounded-2xl p-4 md:p-8 text-center ${
              darkMode 
                ? 'bg-green-500/20 border-2 border-green-400/50 backdrop-blur-md shadow-professional-lg' 
                : 'bg-green-50 border border-green-300 shadow-lg'
            }`}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-4">✅ Message Delivered Successfully!</h2>
            <p className="text-base md:text-xl mb-2">
              Original Message: <span className={`font-mono px-3 md:px-4 py-1 md:py-2 rounded ${
                darkMode ? 'bg-white/10' : 'bg-white'
              }`}>{message}</span>
            </p>
            <p className="text-sm md:text-lg">Transmission Time: {transmissionTime}s</p>
            <p className="text-sm md:text-lg mb-4">
              Total Overhead: {packetData.totalOverhead} bytes ({packetData.overheadPercentage}%)
            </p>
            <button
              onClick={resetSimulation}
              className="px-4 md:px-6 py-2 md:py-3 professional-button rounded-lg font-semibold text-sm md:text-base"
            >
              Send Another Message
            </button>
          </motion.div>
        )}

        {/* Error Simulation Modal */}
        <AnimatePresence>
          {currentError && (
            <ErrorSimulation
              layer={currentError}
              onResolve={() => {
                if (window.errorResolveCallback) {
                  window.errorResolveCallback()
                }
              }}
            />
          )}
        </AnimatePresence>

        {/* Layer Details Modal */}
        <AnimatePresence>
          {selectedLayer && (
            <SimulationModal layer={selectedLayer} onClose={() => setSelectedLayer(null)} />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App
