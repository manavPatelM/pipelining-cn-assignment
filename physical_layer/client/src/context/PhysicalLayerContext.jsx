import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Key for sessionStorage
const SESSION_STORAGE_KEY = 'physicalLayerState';

// Initial state for the Physical Layer simulation
const initialState = {
  currentStep: 0,
  frameData: 'Test',
  inputType: 'text', // 'text', 'hex', or 'binary'
  binaryData: '01010101110001001',
  nrzLSignal: [],
  nrzISignal: [],
  manchesterSignal: [],
  amiSignal: [],
  pseudoternarySignal: [],
  modulatedSignal: [],
  demodulatedSignal: [],
  noisySignal: [],
  receivedSignal: [],
  berResult: null,
  hybridTopology: null,
  propagationDelay: 0,
  transmissionTime: 0,
  attenuatedSignal: [],
  tdmSignal: [],
  finalWaveform: [],
  parameters: {
    distance: 1000, // meters
    bitRate: 1000, // bits per second
    noiseLevel: 0.1,
    attenuationFactor: 0.8,
    propagationSpeed: 200000000, // m/s (2/3 speed of light in cable)
    modulationType: 'ASK', // ASK, FSK, PSK
    carrierFreq: 10,
    freq0: 5, // FSK frequency for '0'
    freq1: 10, // FSK frequency for '1'
  },
  results: {}
};

// Action types
const ACTIONS = {
  SET_FRAME_DATA: 'SET_FRAME_DATA',
  SET_INPUT_TYPE: 'SET_INPUT_TYPE',
  SET_BINARY_DATA: 'SET_BINARY_DATA',
  SET_NRZ_L_SIGNAL: 'SET_NRZ_L_SIGNAL',
  SET_NRZ_I_SIGNAL: 'SET_NRZ_I_SIGNAL',
  SET_MANCHESTER_SIGNAL: 'SET_MANCHESTER_SIGNAL',
  SET_AMI_SIGNAL: 'SET_AMI_SIGNAL',
  SET_PSEUDOTERNARY_SIGNAL: 'SET_PSEUDOTERNARY_SIGNAL',
  SET_MODULATED_SIGNAL: 'SET_MODULATED_SIGNAL',
  SET_DEMODULATED_SIGNAL: 'SET_DEMODULATED_SIGNAL',
  SET_NOISY_SIGNAL: 'SET_NOISY_SIGNAL',
  SET_RECEIVED_SIGNAL: 'SET_RECEIVED_SIGNAL',
  SET_BER_RESULT: 'SET_BER_RESULT',
  SET_HYBRID_TOPOLOGY: 'SET_HYBRID_TOPOLOGY',
  SET_PROPAGATION_DATA: 'SET_PROPAGATION_DATA',
  SET_ATTENUATED_SIGNAL: 'SET_ATTENUATED_SIGNAL',
  SET_TDM_SIGNAL: 'SET_TDM_SIGNAL',
  SET_FINAL_WAVEFORM: 'SET_FINAL_WAVEFORM',
  UPDATE_PARAMETERS: 'UPDATE_PARAMETERS',
  NEXT_STEP: 'NEXT_STEP',
  PREV_STEP: 'PREV_STEP',
  RESET: 'RESET',
  SET_STEP: 'SET_STEP',
};

// Reducer function
const physicalLayerReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_FRAME_DATA:
      return { ...state, frameData: action.payload };
    case ACTIONS.SET_INPUT_TYPE:
      return { ...state, inputType: action.payload };
    case ACTIONS.SET_BINARY_DATA:
      return { ...state, binaryData: action.payload };
    case ACTIONS.SET_NRZ_L_SIGNAL:
      return { ...state, nrzLSignal: action.payload };
    case ACTIONS.SET_NRZ_I_SIGNAL:
      return { ...state, nrzISignal: action.payload };
    case ACTIONS.SET_MANCHESTER_SIGNAL:
      return { ...state, manchesterSignal: action.payload };
    case ACTIONS.SET_AMI_SIGNAL:
      return { ...state, amiSignal: action.payload };
    case ACTIONS.SET_PSEUDOTERNARY_SIGNAL:
      return { ...state, pseudoternarySignal: action.payload };
    case ACTIONS.SET_MODULATED_SIGNAL:
      return { ...state, modulatedSignal: action.payload };
    case ACTIONS.SET_DEMODULATED_SIGNAL:
      return { ...state, demodulatedSignal: action.payload };
    case ACTIONS.SET_NOISY_SIGNAL:
      return { ...state, noisySignal: action.payload };
    case ACTIONS.SET_RECEIVED_SIGNAL:
      return { ...state, receivedSignal: action.payload };
    case ACTIONS.SET_BER_RESULT:
      return { ...state, berResult: action.payload };
    case ACTIONS.SET_HYBRID_TOPOLOGY:
      return { ...state, hybridTopology: action.payload };
    case ACTIONS.SET_PROPAGATION_DATA:
      return { 
        ...state, 
        propagationDelay: action.payload.propagationDelay,
        transmissionTime: action.payload.transmissionTime
      };
    case ACTIONS.SET_ATTENUATED_SIGNAL:
      return { ...state, attenuatedSignal: action.payload };
    case ACTIONS.SET_TDM_SIGNAL:
      return { ...state, tdmSignal: action.payload };
    case ACTIONS.SET_FINAL_WAVEFORM:
      return { ...state, finalWaveform: action.payload };
    case ACTIONS.UPDATE_PARAMETERS:
      return { 
        ...state, 
        parameters: { ...state.parameters, ...action.payload }
      };
    case ACTIONS.NEXT_STEP:
      return { ...state, currentStep: Math.min(state.currentStep + 1, 12) };
    case ACTIONS.PREV_STEP:
      return { ...state, currentStep: Math.max(state.currentStep - 1, 0) };
    case ACTIONS.SET_STEP:
      return { ...state, currentStep: action.payload };
    case ACTIONS.RESET:
      // Clear session storage on reset
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      return initialState;
    default:
      return state;
  }
};

// Create context
const PhysicalLayerContext = createContext();

// Provider component
export const PhysicalLayerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(physicalLayerReducer, initialState, (initial) => {
    try {
      const storedState = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (storedState) {
        const parsedState = JSON.parse(storedState);
        // After redirecting from Hybrid Topology, advance to next step
        if (parsedState.currentStep === 9) {
          parsedState.currentStep = 10;
        }
        return parsedState;
      }
    } catch (error) {
      console.error("Failed to parse state from sessionStorage", error);
    }
    return initial;
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save state to sessionStorage", error);
    }
  }, [state]);

  const value = {
    state,
    dispatch,
    actions: ACTIONS,
  };

  return (
    <PhysicalLayerContext.Provider value={value}>
      {children}
    </PhysicalLayerContext.Provider>
  );
};

// Hook to use the context
export const usePhysicalLayer = () => {
  const context = useContext(PhysicalLayerContext);
  if (!context) {
    throw new Error('usePhysicalLayer must be used within a PhysicalLayerProvider');
  }
  return context;
};

export default PhysicalLayerContext;