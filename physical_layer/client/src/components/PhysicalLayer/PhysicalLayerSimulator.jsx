import React from 'react';
import { usePhysicalLayerOperations } from '../../hooks/usePhysicalLayerOperations';
import FrameToBinaryStep from './FrameToBinaryStep';
import NRZLEncodingStep from './NRZLEncodingStep';
import NRZIEncodingStep from './NRZIEncodingStep';
import ManchesterEncodingStep from './ManchesterEncodingStep';
import AMIEncodingStep from './AMIEncodingStep';
import PseudoternaryEncodingStep from './PseudoternaryEncodingStep';
import ModulationDemodulationStep from './ModulationDemodulationStep';
import NoiseSimulationStep from './NoiseSimulationStep';
import BERCalculationStep from './BERCalculationStep';
import HybridTopologyStep from './HybridTopologyStep';
import SignalAttenuationStep from './SignalAttenuationStep';
import TDMSimulationStep from './TDMSimulationStep';
import FinalWaveformStep from './FinalWaveformStep';

const PhysicalLayerSimulator = () => {
  const {
    state,
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
    executeFullPipeline,
    nextStep,
    prevStep,
    goToStep,
    updateParameters,
    resetSimulation,
  } = usePhysicalLayerOperations();

  const steps = [
    {
      id: 0,
      title: 'Frame to Binary',
      component: FrameToBinaryStep,
      description: 'Convert frame data to binary bitstream'
    },
    {
      id: 1,
      title: 'NRZ-L Encoding',
      component: NRZLEncodingStep,
      description: 'Non-Return-to-Zero Level encoding'
    },
    {
      id: 2,
      title: 'NRZ-I Encoding',
      component: NRZIEncodingStep,
      description: 'Non-Return-to-Zero Inverted encoding'
    },
    {
      id: 3,
      title: 'Manchester Encoding',
      component: ManchesterEncodingStep,
      description: 'Manchester differential encoding'
    },
    {
      id: 4,
      title: 'AMI Encoding',
      component: AMIEncodingStep,
      description: 'Alternate Mark Inversion encoding'
    },
    {
      id: 5,
      title: 'Pseudoternary Encoding',
      component: PseudoternaryEncodingStep,
      description: 'Pseudoternary line encoding'
    },
    {
      id: 6,
      title: 'Modulation/Demodulation',
      component: ModulationDemodulationStep,
      description: 'Digital modulation and demodulation'
    },
    {
      id: 7,
      title: 'Noise Simulation',
      component: NoiseSimulationStep,
      description: 'Add channel noise to signal'
    },
    {
      id: 8,
      title: 'BER Calculation',
      component: BERCalculationStep,
      description: 'Calculate bit error rate'
    },
    {
      id: 9,
      title: 'Hybrid Topology',
      component: HybridTopologyStep,
      description: 'Network topology analysis'
    },
    {
      id: 10,
      title: 'Signal Attenuation',
      component: SignalAttenuationStep,
      description: 'Simulate signal loss over distance'
    },
    {
      id: 11,
      title: 'TDM Simulation',
      component: TDMSimulationStep,
      description: 'Time-division multiplexing'
    },
    {
      id: 12,
      title: 'Final Waveforms',
      component: FinalWaveformStep,
      description: 'Complete waveform analysis'
    }
  ];

  const currentStepData = steps[state.currentStep];
  const CurrentStepComponent = currentStepData.component;

  const handleExecuteFullPipeline = async () => {
    try {
      if (state.frameData) {
        await executeFullPipeline(state.frameData);
        goToStep(12); // Go to final step
      }
    } catch (error) {
      console.error('Pipeline execution failed:', error);
    }
  };

  const getStepStatus = (stepId) => {
    if (stepId < state.currentStep) return 'completed';
    if (stepId === state.currentStep) return 'current';
    return 'pending';
  };

  const isStepAccessible = (stepId) => {
    // Step 0 is always accessible
    if (stepId === 0) return true;
    
    // For other steps, check if previous requirements are met
    switch (stepId) {
      case 1:
      case 2:
      case 3:
        return !!state.binaryData;
      case 4:
        return !!state.binaryData;
      case 5:
        return !!state.binaryData;
      case 6:
        // Need some base signal to modulate
        return !!(state.nrzLSignal?.signal || state.nrzISignal?.signal || state.manchesterSignal?.signal || state.binaryData);
      case 7:
        return !!(state.nrzLSignal?.signal || state.nrzISignal?.signal || state.manchesterSignal?.signal);
      case 8:
        return !!state.binaryData;
      case 9:
        return !!state.binaryData;
      case 10:
        return !!(state.noisySignal?.length || state.nrzLSignal?.signal || state.manchesterSignal?.signal || state.nrzISignal?.signal);
      case 11:
        return !!state.binaryData;
      case 12:
        return !!(state.attenuatedSignal?.attenuatedSignal?.length || state.noisySignal?.length || state.nrzLSignal?.signal || state.manchesterSignal?.signal || state.nrzISignal?.signal);
      default:
        return false;
    }
  };

  return (
    <div className="physical-layer-simulator min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Physical Layer Simulator
                </h1>
                <p className="mt-2 text-gray-600">
                  Comprehensive simulation of bits, encoding, and transmission
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleExecuteFullPipeline}
                  disabled={!state.frameData}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                >
                  🚀 Execute Full Pipeline
                </button>
                
                <button
                  onClick={resetSimulation}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
                >
                  🔄 Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Step Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Simulation Steps
              </h3>
              
              <div className="space-y-2">
                {steps.map((step) => {
                  const status = getStepStatus(step.id);
                  const accessible = isStepAccessible(step.id);
                  
                  return (
                    <button
                      key={step.id}
                      onClick={() => accessible && goToStep(step.id)}
                      disabled={!accessible}
                      className={`w-full text-left p-3 rounded-lg transition-all ${
                        status === 'current'
                          ? 'bg-blue-100 border-2 border-blue-500 text-blue-800'
                          : status === 'completed'
                          ? 'bg-green-100 border border-green-300 text-green-800'
                          : accessible
                          ? 'bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100'
                          : 'bg-gray-50 border border-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          status === 'current'
                            ? 'bg-blue-600 text-white'
                            : status === 'completed'
                            ? 'bg-green-600 text-white'
                            : accessible
                            ? 'bg-gray-300 text-gray-600'
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {status === 'completed' ? '✓' : step.id + 1}
                        </div>
                        
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {step.title}
                          </div>
                          <div className="text-xs opacity-75">
                            {step.description}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Progress Summary */}
              <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  Progress: {state.currentStep + 1}/{steps.length}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((state.currentStep + 1) / steps.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-lg">
              <CurrentStepComponent
                // Common props for all steps
                binaryData={state.binaryData}
                parameters={state.parameters}
                onUpdateParameters={updateParameters}
                
                // Step 0: Frame to Binary props
                onConvert={convertFrameToBinary}
                frameData={state.frameData}
                
                // Step 1: NRZ-L Encoding props
                nrzLSignal={state.nrzLSignal}
                onNRZLEncode={performNRZLEncoding}
                
                // Step 2: NRZ-I Encoding props  
                nrzISignal={state.nrzISignal}
                onNRZIEncode={performNRZIEncoding}
                
                // Step 3: Manchester Encoding props
                manchesterSignal={state.manchesterSignal}
                onManchesterEncode={performManchesterEncoding}
                
                // Step 4: AMI Encoding props
                amiSignal={state.amiSignal}
                onAMIEncode={performAMIEncoding}
                
                // Step 5: Pseudoternary Encoding props
                pseudoternarySignal={state.pseudoternarySignal}
                onPseudoternaryEncode={performPseudoternaryEncoding}
                
                // Step 6: Modulation/Demodulation props
                modulatedSignal={state.modulatedSignal}
                demodulatedSignal={state.demodulatedSignal}
                onModulate={performModulation}
                onDemodulate={performDemodulation}
                
                // Step 7: Noise Simulation props
                noisySignal={state.noisySignal}
                onAddNoise={addNoiseToSignal}
                
                // Step 8: BER Calculation props
                berResult={state.berResult}
                receivedSignal={state.receivedSignal}
                onCalculateBER={calculateBitErrorRate}
                
                // Step 9: Hybrid Topology props
                hybridTopology={state.hybridTopology}
                onSimulateTopology={simulateHybridTopologyStep}
                
                // Step 10: Signal Attenuation props
                attenuatedSignal={state.attenuatedSignal}
                onSimulateAttenuation={simulateSignalAttenuation}
                
                // Step 11: Propagation Timing props
                propagationDelay={state.propagationDelay}
                transmissionTime={state.transmissionTime}
                onCalculateTimings={calculatePropagationData}
                
                // Step 12: TDM Simulation props
                tdmSignal={state.tdmSignal}
                onPerformTDM={performTDMSimulation}
                
                // Step 13: Final Waveform props
                finalWaveform={state.finalWaveform}
                onGenerateFinal={generateFinalWaveform}
              />
            </div>

            {/* Navigation */}
            <div className="mt-6 flex justify-between">
              <button
                onClick={prevStep}
                disabled={state.currentStep === 0}
                className="px-6 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                ← Previous Step
              </button>
              
              <div className="text-center">
                <div className="text-sm text-gray-600 mb-1">
                  Step {state.currentStep + 1} of {steps.length}
                </div>
                <div className="font-medium text-gray-800">
                  {currentStepData.title}
                </div>
              </div>
              
              <button
                onClick={nextStep}
                disabled={state.currentStep === steps.length - 1}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                Next Step →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhysicalLayerSimulator;