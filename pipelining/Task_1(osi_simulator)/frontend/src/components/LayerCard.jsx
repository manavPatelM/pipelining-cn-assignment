import { motion } from 'framer-motion'

const LayerCard = ({ layer, isActive, isCompleted, onClick, darkMode = true }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        border rounded-xl p-3 md:p-4 cursor-pointer transition-all duration-300
        ${darkMode 
          ? isActive ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border-yellow-400 shadow-professional backdrop-blur-md' : 
            isCompleted ? 'bg-gradient-to-br from-green-500/20 to-green-600/10 border-green-400 backdrop-blur-md' : 
            'glass-effect hover:bg-professional-accent/20'
          : isActive ? 'bg-yellow-50 border-yellow-400 shadow-lg shadow-yellow-400/50' : 
            isCompleted ? 'bg-green-50 border-green-400' : 
            'bg-white border-gray-200 hover:bg-gray-50'
        }
      `}
      style={{
        borderColor: isActive || isCompleted ? layer.color : undefined,
        boxShadow: isActive ? `0 0 25px ${layer.color}80, 0 4px 20px rgba(30, 64, 175, 0.3)` : undefined
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-sm md:text-lg truncate">{layer.name}</h3>
          <p className={`text-xs md:text-sm ${darkMode ? 'text-blue-300' : 'text-gray-600'}`}>
            {layer.protocol}
          </p>
        </div>
        <div className="text-2xl md:text-3xl ml-2">
          {isActive ? '⚡' : isCompleted ? '✅' : '⭕'}
        </div>
      </div>
      <p className={`text-xs mt-2 ${darkMode ? 'text-blue-200' : 'text-gray-600'}`}>
        {layer.function}
      </p>
      {isActive && (
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 1.2 }}
          className="h-1 bg-yellow-400 rounded-full mt-2"
        />
      )}
    </motion.div>
  )
}

export default LayerCard
