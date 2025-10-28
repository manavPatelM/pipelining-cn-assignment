import { useCallback } from 'react';
import { usePhysicalLayer } from '../context/PhysicalLayerContext';
import {
  frameToBinary,
  convertToBinary,
  binaryToArray,
  nrzLEncoding,
  nrzIEncoding,
  manchesterEncoding,
  amiEncoding,
  pseudoternaryEncoding,
  askModulation,
  fskModulation,
  pskModulation,
  simpleDemodulation,
  simulateHybridTopology,
  addNoise,
  calculateBER,
  calculateTimings,
  simulateAttenuation,
  simulateTDM,
  signalToBits,
} from '../utils/physicalLayerUtils';

export const usePhysicalLayerOperations = () => {
  const { state, dispatch, actions } = usePhysicalLayer();

  const convertFrameToBinary = useCallback((frameData, inputType = 'text') => {
    const binary = convertToBinary(frameData, inputType);
    dispatch({ type: actions.SET_BINARY_DATA, payload: binary });
    dispatch({ type: actions.SET_FRAME_DATA, payload: frameData });
    dispatch({ type: actions.SET_INPUT_TYPE, payload: inputType });
    return binary;
  }, [dispatch, actions]);

  const performNRZLEncoding = useCallback((binaryData, amplitude = 5) => {
    const bits = binaryToArray(binaryData);
    const signal = nrzLEncoding(bits, amplitude);
    dispatch({ type: actions.SET_NRZ_L_SIGNAL, payload: signal });
    return signal;
  }, [dispatch, actions]);

  const performNRZIEncoding = useCallback((binaryData, amplitude = 5) => {
    const bits = binaryToArray(binaryData);
    const signal = nrzIEncoding(bits, amplitude);
    dispatch({ type: actions.SET_NRZ_I_SIGNAL, payload: signal });
    return signal;
  }, [dispatch, actions]);

  const performManchesterEncoding = useCallback((binaryData, amplitude = 5) => {
    const bits = binaryToArray(binaryData);
    const signal = manchesterEncoding(bits, amplitude);
    dispatch({ type: actions.SET_MANCHESTER_SIGNAL, payload: signal });
    return signal;
  }, [dispatch, actions]);

  const performAMIEncoding = useCallback((binaryData, amplitude = 5) => {
    const bits = binaryToArray(binaryData);
    const signal = amiEncoding(bits, amplitude);
    dispatch({ type: actions.SET_AMI_SIGNAL, payload: signal });
    return signal;
  }, [dispatch, actions]);

  const performPseudoternaryEncoding = useCallback((binaryData, amplitude = 5) => {
    const bits = binaryToArray(binaryData);
    const signal = pseudoternaryEncoding(bits, amplitude);
    dispatch({ type: actions.SET_PSEUDOTERNARY_SIGNAL, payload: signal });
    return signal;
  }, [dispatch, actions]);

  const performModulation = useCallback((input, modulationType = 'ASK', params = {}) => {
    // Normalize input to bits array
    let bits;
    if (!input) bits = [];
    else if (typeof input === 'string') bits = binaryToArray(input);
    else if (Array.isArray(input)) bits = input;
    else if (typeof input === 'object' && Array.isArray(input.signal)) {
      // Convert signal waveform to bits by thresholding
      bits = signalToBits(input.signal);
    } else {
      bits = [];
    }

    let modulatedSignal;
    const defaultParams = {
      carrierFreq: 10,
      freq0: 5,
      freq1: 15,
      ...params,
    };

    switch ((modulationType || 'ASK').toUpperCase()) {
      case 'ASK':
        modulatedSignal = askModulation(bits, defaultParams.carrierFreq);
        break;
      case 'FSK':
        modulatedSignal = fskModulation(bits, defaultParams.freq0, defaultParams.freq1);
        break;
      case 'PSK':
        modulatedSignal = pskModulation(bits, defaultParams.carrierFreq);
        break;
      default:
        modulatedSignal = askModulation(bits, defaultParams.carrierFreq);
    }

    dispatch({ type: actions.SET_MODULATED_SIGNAL, payload: modulatedSignal });
    return modulatedSignal;
  }, [dispatch, actions]);

  const performDemodulation = useCallback((modulated, modulationType = 'ASK') => {
    // Extract raw array if an object was provided
    const raw = (modulated && typeof modulated === 'object' && Array.isArray(modulated.signal))
      ? modulated.signal
      : Array.isArray(modulated) ? modulated : [];
    // Use default samplesPerBit assumption from util (100)
    const demodulatedSignal = simpleDemodulation(raw);
    dispatch({ type: actions.SET_DEMODULATED_SIGNAL, payload: demodulatedSignal });
    return demodulatedSignal;
  }, [dispatch, actions]);

  const simulateHybridTopologyStep = useCallback((nodeCount = 8, config = {}) => {
    const topology = simulateHybridTopology(nodeCount, config);
    dispatch({ type: actions.SET_HYBRID_TOPOLOGY, payload: topology });
    return topology;
  }, [dispatch, actions]);

  const addNoiseToSignal = useCallback((signal, noiseLevel = 0.1, noiseType = 'gaussian') => {
    const noisySignal = addNoise(signal, noiseLevel, noiseType);
    dispatch({ type: actions.SET_NOISY_SIGNAL, payload: noisySignal });
    return noisySignal;
  }, [dispatch, actions]);

  const calculateBitErrorRate = useCallback((originalBits, receivedBits) => {
    // Normalize to arrays of 0/1
    const orig = typeof originalBits === 'string' ? binaryToArray(originalBits) : originalBits || [];
    const recv = typeof receivedBits === 'string' ? binaryToArray(receivedBits) : receivedBits || [];
    const ber = calculateBER(orig, recv);
    dispatch({ type: actions.SET_BER_RESULT, payload: ber });
    return ber;
  }, [dispatch, actions]);

  const calculatePropagationData = useCallback((distance) => {
    const bitRate = state.parameters?.bitRate ?? 1000;
    const frameSize = (state.binaryData?.length) ?? 0;
    const propagationSpeed = state.parameters?.propagationSpeed ?? 200000000;
    const timings = calculateTimings(distance, bitRate, frameSize, propagationSpeed);
    dispatch({ type: actions.SET_PROPAGATION_DATA, payload: timings });
    return timings;
  }, [dispatch, actions, state.parameters, state.binaryData]);

  const simulateSignalAttenuation = useCallback((signal, distance, config = {}) => {
    console.log('Hook: simulateSignalAttenuation called', { signal: signal?.length, distance, config });
    const attenuationFactor = config.attenuationFactor || 0.001;
    const attenuatedSignal = simulateAttenuation(signal, distance, attenuationFactor);
    console.log('Hook: Attenuation result', attenuatedSignal);
    dispatch({ type: actions.SET_ATTENUATED_SIGNAL, payload: attenuatedSignal });
    return attenuatedSignal;
  }, [dispatch, actions]);

  const performTDMSimulation = useCallback((channels, timeSlots = 4) => {
    const tdmResult = simulateTDM(channels, timeSlots);
    dispatch({ type: actions.SET_TDM_SIGNAL, payload: tdmResult });
    return tdmResult;
  }, [dispatch, actions]);

  const generateFinalWaveform = useCallback(() => {
    console.log('GenerateFinalWaveform: Starting generation with state:', {
      attenuatedSignal: state.attenuatedSignal ? 'Available' : 'Missing',
      tdmSignal: state.tdmSignal ? 'Available' : 'Missing',
      noisySignal: state.noisySignal?.length || 0,
      allEncodings: {
        nrzl: state.nrzlSignal?.signal?.length || 0,
        nrzi: state.nrziSignal?.signal?.length || 0,
        manchester: state.manchesterSignal?.signal?.length || 0,
        ami: state.amiSignal?.signal?.length || 0,
        pseudoternary: state.pseudoternarySignal?.signal?.length || 0
      }
    });

    // Priority: Use the most processed signal available
    let finalSignalData = null;
    let signalSource = 'unknown';

    if (state.attenuatedSignal?.attenuatedSignal) {
      finalSignalData = state.attenuatedSignal;
      signalSource = 'attenuated';
    } else if (state.noisySignal?.length) {
      finalSignalData = { attenuatedSignal: state.noisySignal };
      signalSource = 'noisy';
    } else if (state.pseudoternarySignal?.signal) {
      finalSignalData = { attenuatedSignal: state.pseudoternarySignal.signal };
      signalSource = 'pseudoternary';
    } else if (state.amiSignal?.signal) {
      finalSignalData = { attenuatedSignal: state.amiSignal.signal };
      signalSource = 'ami';
    } else if (state.manchesterSignal?.signal) {
      finalSignalData = { attenuatedSignal: state.manchesterSignal.signal };
      signalSource = 'manchester';
    } else if (state.nrzlSignal?.signal) {
      finalSignalData = { attenuatedSignal: state.nrzlSignal.signal };
      signalSource = 'nrzl';
    } else if (state.nrziSignal?.signal) {
      finalSignalData = { attenuatedSignal: state.nrziSignal.signal };
      signalSource = 'nrzi';
    }

    if (!finalSignalData) {
      console.warn('GenerateFinalWaveform: No signal data available');
      return null;
    }

    const waveform = finalSignalData.attenuatedSignal;
    const finalBits = signalToBits(waveform);
    
    const finalSignal = {
      bits: finalBits,
      waveform,
      signalSource,
      timestamp: Date.now(),
      // Include all available encodings for comparison
      encodings: {
        original: state.nrzlSignal,
        nrzi: state.nrziSignal,
        manchester: state.manchesterSignal,
        ami: state.amiSignal,
        pseudoternary: state.pseudoternarySignal
      },
      processing: {
        noisy: state.noisySignal,
        attenuated: state.attenuatedSignal,
        tdm: state.tdmSignal
      }
    };

    console.log('GenerateFinalWaveform: Generated final signal:', {
      bitsLength: finalBits.length,
      waveformLength: waveform.length,
      signalSource,
      timestamp: finalSignal.timestamp
    });

    dispatch({ type: actions.SET_FINAL_WAVEFORM, payload: finalSignal });
    return finalSignal;
  }, [dispatch, actions, state]);

  // Navigation and utility functions
  const nextStep = useCallback(() => {
    dispatch({ type: actions.NEXT_STEP });
  }, [dispatch, actions]);

  const prevStep = useCallback(() => {
    dispatch({ type: actions.PREV_STEP });
  }, [dispatch, actions]);

  const goToStep = useCallback((step) => {
    dispatch({ type: actions.SET_STEP, payload: step });
  }, [dispatch, actions]);

  const updateParameters = useCallback((newParams) => {
    dispatch({ type: actions.UPDATE_PARAMETERS, payload: newParams });
  }, [dispatch, actions]);

  const resetSimulation = useCallback(() => {
    dispatch({ type: actions.RESET });
  }, [dispatch, actions]);

  const executeFullPipeline = useCallback(async (frameData) => {
    try {
      const binary = convertFrameToBinary(frameData, state.inputType);
      const nrzlSignal = performNRZLEncoding(binary);
  const nrziSignal = performNRZIEncoding(binary);
  const manchesterSignal = performManchesterEncoding(binary);
  const amiSignal = performAMIEncoding(binary);
  const pseudoternarySignal = performPseudoternaryEncoding(binary);
  const modulatedSignal = performModulation(binary);
  const demodulatedSignal = performDemodulation(modulatedSignal);
      const topology = simulateHybridTopologyStep();
  // Use NRZ-L waveform's raw signal for channel impairment simulations
  const noisySignal = addNoiseToSignal(nrzlSignal.signal);
  const ber = calculateBitErrorRate(binary, signalToBits(noisySignal));
  const timings = calculatePropagationData(1000);
  const attenuatedSignal = simulateSignalAttenuation(noisySignal, 1000);
      const tdmResult = performTDMSimulation([binary]);
      const finalWaveform = generateFinalWaveform(attenuatedSignal);
      
      return {
        binary,
        nrzlSignal,
        nrziSignal,
        manchesterSignal,
        amiSignal,
        pseudoternarySignal,
        modulatedSignal,
        demodulatedSignal,
        topology,
        noisySignal,
        ber,
        timings,
        attenuatedSignal,
        tdmResult,
        finalWaveform
      };
    } catch (error) {
      console.error('Error in pipeline execution:', error);
      throw error;
    }
  }, [
    convertFrameToBinary,
    performNRZLEncoding,
    performNRZIEncoding,
    performManchesterEncoding,
    performAMIEncoding,
    performPseudoternaryEncoding,
    performModulation,
    performDemodulation,
    simulateHybridTopologyStep,
    addNoiseToSignal,
    calculateBitErrorRate,
    calculatePropagationData,
    simulateSignalAttenuation,
    performTDMSimulation,
    generateFinalWaveform,
    state
  ]);

  return {
    convertFrameToBinary,
    performNRZLEncoding,
    performManchesterEncoding,
    performNRZIEncoding,
    performAMIEncoding,
    performPseudoternaryEncoding,
    performModulation,
    performDemodulation,
    simulateHybridTopologyStep,
    addNoiseToSignal,
    calculateBitErrorRate,
    calculatePropagationData,
    simulateSignalAttenuation,
    performTDMSimulation,
    generateFinalWaveform,
    executeFullPipeline,
    nextStep,
    prevStep,
    goToStep,
    updateParameters,
    resetSimulation,
    state
  };
};

export default usePhysicalLayerOperations;