// Utility functions for Physical Layer simulations

/**
 * Convert frame data (string) to binary bitstream
 * @param {string} frameData - Input frame data
 * @returns {string} Binary representation
 */
export const frameToBinary = (frameData) => {
  if (!frameData) return '';
  
  return frameData
    .split('')
    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');
};

/**
 * Convert hexadecimal string to binary bitstream
 * @param {string} hexData - Input hexadecimal data (e.g., "FFFF")
 * @returns {string} Binary representation
 */
export const hexToBinary = (hexData) => {
  if (!hexData) return '';
  
  // Remove any spaces or "0x" prefix
  const cleanHex = hexData.replace(/\s+/g, '').replace(/^0x/i, '');
  
  return cleanHex
    .split('')
    .map(hexChar => {
      // Convert each hex character to 4-bit binary
      const decimal = parseInt(hexChar, 16);
      if (isNaN(decimal)) return '0000'; // Handle invalid hex chars
      return decimal.toString(2).padStart(4, '0');
    })
    .join('');
};

/**
 * Detect input type and convert to binary accordingly
 * @param {string} inputData - Input data
 * @param {string} inputType - 'text', 'hex', or 'binary'
 * @returns {string} Binary representation
 */
export const convertToBinary = (inputData, inputType = 'auto') => {
  if (!inputData) return '';
  
  if (inputType === 'auto') {
    // Auto-detect input type
    const cleanData = inputData.replace(/\s+/g, '');
    
    // Check if it's binary (only 0s and 1s)
    if (/^[01]+$/.test(cleanData)) {
      return cleanData;
    }
    
    // Check if it's hex (only 0-9, A-F)
    if (/^[0-9A-Fa-f]+$/.test(cleanData)) {
      return hexToBinary(cleanData);
    }
    
    // Otherwise treat as text
    return frameToBinary(inputData);
  }
  
  switch (inputType) {
    case 'hex':
      return hexToBinary(inputData);
    case 'binary':
      return inputData.replace(/\s+/g, '');
    case 'text':
    default:
      return frameToBinary(inputData);
  }
};

/**
 * Convert binary string to array of numbers for signal processing
 * @param {string} binary - Binary string
 * @returns {number[]} Array of 0s and 1s
 */
export const binaryToArray = (binary) => {
  if (!binary || typeof binary !== 'string') {
    return [];
  }
  return binary.split('').map(bit => parseInt(bit));
};

/**
 * Validate binary string input
 * @param {string} input - Input string to validate
 * @returns {object} Validation result with isValid, cleanedInput, and error
 */
export const validateBinaryInput = (input) => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, cleanedInput: '', error: 'Input is required' };
  }
  
  // Remove spaces and convert to string
  const cleaned = input.replace(/\s+/g, '');
  
  // Check if empty after cleaning
  if (cleaned.length === 0) {
    return { isValid: false, cleanedInput: '', error: 'Binary string cannot be empty' };
  }
  
  // Check if too long (limit to 64 bits for visualization)
  if (cleaned.length > 64) {
    return { isValid: false, cleanedInput: cleaned, error: 'Binary string too long (max 64 bits)' };
  }
  
  // Check if contains only 0s and 1s
  if (!/^[01]+$/.test(cleaned)) {
    return { isValid: false, cleanedInput: cleaned, error: 'Binary string can only contain 0s and 1s' };
  }
  
  return { isValid: true, cleanedInput: cleaned, error: null };
};

/**
 * Validate hexadecimal input
 * @param {string} input - Input string to validate
 * @returns {object} Validation result with isValid, cleanedInput, and error
 */
export const validateHexInput = (input) => {
  if (!input || typeof input !== 'string') {
    return { isValid: false, cleanedInput: '', error: 'Input is required' };
  }
  
  // Remove spaces and 0x prefix
  const cleaned = input.replace(/\s+/g, '').replace(/^0x/i, '');
  
  // Check if empty after cleaning
  if (cleaned.length === 0) {
    return { isValid: false, cleanedInput: '', error: 'Hexadecimal string cannot be empty' };
  }
  
  // Check if too long (limit to 16 hex digits = 64 bits for visualization)
  if (cleaned.length > 16) {
    return { isValid: false, cleanedInput: cleaned, error: 'Hexadecimal string too long (max 16 digits)' };
  }
  
  // Check if contains only valid hex characters (0-9, A-F)
  if (!/^[0-9A-Fa-f]+$/.test(cleaned)) {
    return { isValid: false, cleanedInput: cleaned, error: 'Hexadecimal string can only contain 0-9 and A-F' };
  }
  
  return { isValid: true, cleanedInput: cleaned.toUpperCase(), error: null };
};

/**
 * Non-Return-to-Zero Level (NRZ-L) encoding
 * @param {number[]} bits - Array of bits
 * @param {number} samplesPerBit - Samples per bit for visualization
 * @returns {object} NRZ-L signal data
 */
export const nrzLEncoding = (bits, samplesPerBit = 10) => {
  const signal = [];
  const timeAxis = [];
  const bitDuration = 1; // normalized time per bit
  
  bits.forEach((bit, index) => {
    for (let i = 0; i < samplesPerBit; i++) {
      const time = index * bitDuration + (i / samplesPerBit) * bitDuration;
      timeAxis.push(time);
      signal.push(bit === 1 ? 1 : -1); // +1V for 1, -1V for 0
    }
  });
  
  return { signal, timeAxis, encoding: 'NRZ-L' };
};

/**
 * Manchester encoding (IEEE 802.3 standard)
 * @param {number[]} bits - Array of bits
 * @param {number} samplesPerBit - Samples per bit for visualization
 * @returns {object} Manchester signal data
 */
export const manchesterEncoding = (bits, samplesPerBit = 20) => {
  const signal = [];
  const timeAxis = [];
  const bitDuration = 1;
  
  bits.forEach((bit, index) => {
    const halfSamples = samplesPerBit / 2;
    
    for (let i = 0; i < samplesPerBit; i++) {
      const time = index * bitDuration + (i / samplesPerBit) * bitDuration;
      timeAxis.push(time);
      
      if (bit === 0) {
        // '1' is represented as high-to-low transition
        signal.push(i < halfSamples ? 1 : -1);
      } else {
        // '0' is represented as low-to-high transition
        signal.push(i < halfSamples ? -1 : 1);
      }
    }
  });
  
  return { signal, timeAxis, encoding: 'Manchester' };
};

/**
 * Non-Return-to-Zero Inverted (NRZ-I) encoding
 * @param {number[]} bits - Array of bits
 * @param {number} samplesPerBit - Samples per bit for visualization
 * @returns {object} NRZ-I signal data
 */
export const nrzIEncoding = (bits, samplesPerBit = 10) => {
  const signal = [];
  const timeAxis = [];
  const bitDuration = 1;
  let currentLevel = 1; // Start with high level
  
  bits.forEach((bit, index) => {
    if (bit === 1) {
      // Invert the signal for '1'
      currentLevel = currentLevel === 1 ? -1 : 1;
    }
    // No change for '0'
    
    for (let i = 0; i < samplesPerBit; i++) {
      const time = index * bitDuration + (i / samplesPerBit) * bitDuration;
      timeAxis.push(time);
      signal.push(currentLevel);
    }
  });
  
  return { signal, timeAxis, encoding: 'NRZ-I' };
};

/**
 * Alternate Mark Inversion (AMI) encoding
 * @param {number[]} bits - Array of bits
 * @param {number} samplesPerBit - Samples per bit for visualization
 * @returns {object} AMI signal data
 */
export const amiEncoding = (bits, samplesPerBit = 10) => {
  const signal = [];
  const timeAxis = [];
  const bitDuration = 1;
  let currentPolarity = 1; // Start with +1 for first '1' bit
  
  bits.forEach((bit, index) => {
    let voltage;
    
    if (bit === 0) {
      voltage = 0; // '0' is always baseline (0V)
    } else {
      voltage = currentPolarity; // '1' uses current polarity
      currentPolarity = -currentPolarity; // Negate polarity for next '1'
    }
    
    // Create flat signal for each bit (no ripples)
    for (let i = 0; i < samplesPerBit; i++) {
      const time = index * bitDuration + (i / samplesPerBit) * bitDuration;
      timeAxis.push(time);
      signal.push(voltage); // Same voltage for entire bit duration
    }
  });
  
  return { signal, timeAxis, encoding: 'AMI' };
};

/**
 * Pseudoternary encoding
 * @param {number[]} bits - Array of bits
 * @param {number} samplesPerBit - Samples per bit for visualization
 * @returns {object} Pseudoternary signal data
 */
export const pseudoternaryEncoding = (bits, samplesPerBit = 10) => {
  const signal = [];
  const timeAxis = [];
  const bitDuration = 1;
  let currentPolarity = 1; // Start with +1 for first '0' bit
  
  bits.forEach((bit, index) => {
    let voltage;
    
    if (bit === 1) {
      voltage = 0; // '1' is always baseline (0V)
    } else {
      voltage = currentPolarity; // '0' uses current polarity
      currentPolarity = -currentPolarity; // Negate polarity for next '0'
    }
    
    // Create flat signal for each bit (no ripples)
    for (let i = 0; i < samplesPerBit; i++) {
      const time = index * bitDuration + (i / samplesPerBit) * bitDuration;
      timeAxis.push(time);
      signal.push(voltage); // Same voltage for entire bit duration
    }
  });
  
  return { signal, timeAxis, encoding: 'Pseudoternary' };
};

/**
 * Amplitude Shift Keying (ASK) Modulation
 * @param {number[]} bits - Array of bits
 * @param {number} carrierFreq - Carrier frequency
 * @param {number} samplesPerBit - Samples per bit
 * @returns {object} Modulated signal data
 */
export const askModulation = (bits, carrierFreq = 10, samplesPerBit = 100) => {
  const signal = [];
  const timeAxis = [];
  const bitDuration = 1;
  
  bits.forEach((bit, index) => {
    for (let i = 0; i < samplesPerBit; i++) {
      const time = index * bitDuration + (i / samplesPerBit) * bitDuration;
      timeAxis.push(time);
      
      const carrierValue = Math.sin(2 * Math.PI * carrierFreq * time);
      signal.push(bit === 1 ? carrierValue : 0); // '1' = carrier, '0' = no signal
    }
  });
  
  return { signal, timeAxis, modulation: 'ASK' };
};

/**
 * Frequency Shift Keying (FSK) Modulation
 * @param {number[]} bits - Array of bits
 * @param {number} freq0 - Frequency for bit '0'
 * @param {number} freq1 - Frequency for bit '1'
 * @param {number} samplesPerBit - Samples per bit
 * @returns {object} Modulated signal data
 */
export const fskModulation = (bits, freq0 = 5, freq1 = 10, samplesPerBit = 100) => {
  const signal = [];
  const timeAxis = [];
  const bitDuration = 1;
  
  bits.forEach((bit, index) => {
    for (let i = 0; i < samplesPerBit; i++) {
      const time = index * bitDuration + (i / samplesPerBit) * bitDuration;
      timeAxis.push(time);
      
      const frequency = bit === 1 ? freq1 : freq0;
      signal.push(Math.sin(2 * Math.PI * frequency * time));
    }
  });
  
  return { signal, timeAxis, modulation: 'FSK' };
};

/**
 * Phase Shift Keying (PSK) Modulation
 * @param {number[]} bits - Array of bits
 * @param {number} carrierFreq - Carrier frequency
 * @param {number} samplesPerBit - Samples per bit
 * @returns {object} Modulated signal data
 */
export const pskModulation = (bits, carrierFreq = 10, samplesPerBit = 100) => {
  const signal = [];
  const timeAxis = [];
  const bitDuration = 1;
  
  bits.forEach((bit, index) => {
    for (let i = 0; i < samplesPerBit; i++) {
      const time = index * bitDuration + (i / samplesPerBit) * bitDuration;
      timeAxis.push(time);
      
      const phase = bit === 1 ? 0 : Math.PI; // 0° for '1', 180° for '0'
      signal.push(Math.sin(2 * Math.PI * carrierFreq * time + phase));
    }
  });
  
  return { signal, timeAxis, modulation: 'PSK' };
};

/**
 * Simple demodulation (envelope detection for ASK)
 * @param {number[]} modulatedSignal - Modulated signal
 * @param {number} samplesPerBit - Original samples per bit
 * @returns {number[]} Demodulated bits
 */
export const simpleDemodulation = (modulatedSignal, samplesPerBit = 100) => {
  const demodulatedBits = [];
  const threshold = 0.1;
  
  for (let i = 0; i < modulatedSignal.length; i += samplesPerBit) {
    const segment = modulatedSignal.slice(i, i + samplesPerBit);
    const avgAmplitude = segment.reduce((sum, val) => sum + Math.abs(val), 0) / segment.length;
    demodulatedBits.push(avgAmplitude > threshold ? 1 : 0);
  }
  
  return demodulatedBits;
};

/**
 * Hybrid Network Topology Simulation
 * @param {object} config - Network configuration
 * @returns {object} Topology analysis
 */
export const simulateHybridTopology = (config = {}) => {
  const {
    starNodes = 4,
    ringNodes = 6,
    busNodes = 5,
    meshNodes = 3
  } = config;
  
  const totalNodes = starNodes + ringNodes + busNodes + meshNodes;
  
  // Calculate connections for different topologies
  const starConnections = starNodes; // All connect to central hub
  const ringConnections = ringNodes; // Each connects to two neighbors
  const busConnections = busNodes; // All share common bus
  const meshConnections = (meshNodes * (meshNodes - 1)) / 2; // Full mesh
  
  const totalConnections = starConnections + ringConnections + busConnections + meshConnections;
  
  const advantages = [
    "Fault Tolerance: If one topology segment fails, others remain functional",
    "Scalability: Can expand different segments based on requirements",
    "Cost Optimization: Use expensive topologies (mesh) only where needed",
    "Performance: Combines high-speed segments with cost-effective ones",
    "Flexibility: Supports different device types and requirements",
    "Redundancy: Multiple paths available for critical communications"
  ];
  
  const disadvantages = [
    "Complex Management: Multiple protocols and management systems",
    "Higher Initial Cost: Requires diverse networking equipment",
    "Troubleshooting Difficulty: Complex fault isolation",
    "Protocol Overhead: Different segments may need protocol conversion"
  ];
  
  return {
    topology: 'Hybrid',
    totalNodes,
    totalConnections,
    segments: {
      star: { nodes: starNodes, connections: starConnections },
      ring: { nodes: ringNodes, connections: ringConnections },
      bus: { nodes: busNodes, connections: busConnections },
      mesh: { nodes: meshNodes, connections: meshConnections }
    },
    advantages,
    disadvantages,
    efficiency: totalConnections / totalNodes,
    reliability: 0.85 // High due to multiple topology redundancy
  };
};

/**
 * Add noise to a signal
 * @param {number[]} signal - Original signal
 * @param {number} noiseLevel - Noise level (0-1)
 * @returns {number[]} Noisy signal
 */
export const addNoise = (signal, noiseLevel = 0.1) => {
  return signal.map(sample => {
    const noise = (Math.random() - 0.5) * 2 * noiseLevel;
    return sample + noise;
  });
};

/**
 * Calculate Bit Error Rate (BER)
 * @param {number[]} originalBits - Original bits
 * @param {number[]} receivedBits - Received bits after transmission
 * @returns {object} BER calculation results
 */
export const calculateBER = (originalBits, receivedBits) => {
  if (originalBits.length !== receivedBits.length) {
    return { error: 'Bit sequences must have the same length' };
  }
  
  let errors = 0;
  const totalBits = originalBits.length;
  
  for (let i = 0; i < totalBits; i++) {
    if (originalBits[i] !== receivedBits[i]) {
      errors++;
    }
  }
  
  const ber = errors / totalBits;
  const berPercentage = (ber * 100).toFixed(4);
  
  return {
    errorBits: errors,
    totalBits,
    ber,
    berPercentage,
    quality: ber < 0.001 ? 'Excellent' : ber < 0.01 ? 'Good' : ber < 0.1 ? 'Poor' : 'Very Poor'
  };
};

/**
 * Calculate propagation delay and transmission time
 * @param {number} distance - Distance in meters
 * @param {number} bitRate - Bit rate in bps
 * @param {number} frameSize - Frame size in bits
 * @param {number} propagationSpeed - Speed of signal in medium (m/s)
 * @returns {object} Timing calculations
 */
export const calculateTimings = (distance, bitRate, frameSize, propagationSpeed = 200000000) => {
  const propagationDelay = distance / propagationSpeed; // seconds
  const transmissionTime = frameSize / bitRate; // seconds
  const totalDelay = propagationDelay + transmissionTime;
  
  return {
    propagationDelay: propagationDelay * 1000, // ms
    transmissionTime: transmissionTime * 1000, // ms
    totalDelay: totalDelay * 1000, // ms
    propagationDelayFormatted: `${(propagationDelay * 1000000).toFixed(2)} μs`,
    transmissionTimeFormatted: `${(transmissionTime * 1000).toFixed(2)} ms`,
    totalDelayFormatted: `${(totalDelay * 1000).toFixed(2)} ms`
  };
};

/**
 * Simulate signal attenuation over distance
 * @param {number[]} signal - Original signal
 * @param {number} distance - Distance in meters
 * @param {number} attenuationFactor - Attenuation factor per unit distance
 * @returns {object} Attenuated signal data
 */
export const simulateAttenuation = (signal, distance, attenuationFactor = 0.001) => {
  const attenuation = Math.exp(-attenuationFactor * distance);
  const attenuatedSignal = signal.map(sample => sample * attenuation);
  
  return {
    attenuatedSignal,
    attenuation,
    attenuationDb: -20 * Math.log10(attenuation),
    signalStrength: (attenuation * 100).toFixed(2) + '%'
  };
};

/**
 * Time Division Multiplexing (TDM) simulation
 * @param {Array} dataStreams - Array of data streams to multiplex
 * @param {number} timeSlots - Number of time slots per frame
 * @returns {object} TDM signal data
 */
export const simulateTDM = (dataStreams, timeSlots = 4) => {
  const multiplexedData = [];
  const streamLabels = [];
  const maxLength = Math.max(...dataStreams.map(stream => stream.length));
  
  for (let i = 0; i < maxLength; i++) {
    for (let slot = 0; slot < timeSlots; slot++) {
      if (dataStreams[slot] && i < dataStreams[slot].length) {
        multiplexedData.push(dataStreams[slot][i]);
        streamLabels.push(`Stream ${slot + 1}`);
      } else {
        multiplexedData.push(0); // Empty slot
        streamLabels.push(`Empty`);
      }
    }
  }
  
  return {
    multiplexedData,
    streamLabels,
    timeSlots,
    frameLength: timeSlots,
    totalFrames: Math.ceil(maxLength)
  };
};

/**
 * Convert noisy signal back to digital bits (with threshold)
 * @param {number[]} noisySignal - Signal with noise
 * @param {number} threshold - Decision threshold
 * @param {number} samplesPerBit - Samples per bit
 * @returns {number[]} Recovered bits
 */
export const signalToBits = (noisySignal, threshold = 0, samplesPerBit = 10) => {
  const bits = [];
  
  for (let i = 0; i < noisySignal.length; i += samplesPerBit) {
    // Take average of samples for each bit
    let sum = 0;
    let count = 0;
    
    for (let j = i; j < Math.min(i + samplesPerBit, noisySignal.length); j++) {
      sum += noisySignal[j];
      count++;
    }
    
    const average = sum / count;
    bits.push(average > threshold ? 1 : 0);
  }
  
  return bits;
};

/**
 * Generate sample frame data for testing
 * @param {string} type - Type of sample data ('text', 'binary', 'hex')
 * @returns {string} Sample frame data
 */
export const generateSampleData = (type = 'text') => {
  switch (type) {
    case 'text':
      return 'Hello World!';
    case 'binary':
      return '1010110011001010';
    case 'hex':
      return 'A5C3';
    default:
      return 'Sample';
  }
};