import React, { useState, useEffect } from 'react';
import WaveformChart from '../WaveformChart';

const SignalAttenuationStep = ({ 
  noisySignal, 
  nrzSignal,
  manchesterSignal,
  amiSignal,
  pseudoternarySignal,
  attenuatedSignal, 
  parameters,
  onSimulateAttenuation, 
  onUpdateParameters 
}) => {
  const [distance, setDistance] = useState(parameters?.distance || 1000);
  const [attenuationFactor, setAttenuationFactor] = useState(0.001);
  const [mediumType, setMediumType] = useState('copper');
  const [isSimulating, setIsSimulating] = useState(false);

  const getAvailableSignal = () => {
    // Priority: Noisy signal > Most recent encoding > NRZ-L as fallback
    if (noisySignal?.length) return noisySignal;
    if (pseudoternarySignal?.signal?.length) return pseudoternarySignal.signal;
    if (amiSignal?.signal?.length) return amiSignal.signal;
    if (manchesterSignal?.signal?.length) return manchesterSignal.signal;
    if (nrzSignal?.signal?.length) return nrzSignal.signal;
    return null;
  };

  useEffect(() => {
    const availableSignal = getAvailableSignal();
    if (availableSignal && !attenuatedSignal?.attenuatedSignal) {
      console.log('useEffect: Auto-triggering attenuation simulation');
      handleSimulateAttenuation();
    }
  }, [noisySignal, nrzSignal, manchesterSignal, amiSignal, pseudoternarySignal, attenuatedSignal]); // Added all signal types

  const handleSimulateAttenuation = async () => {
    setIsSimulating(true);
    const signalToUse = getAvailableSignal();
    console.log('SignalAttenuationStep: Attempting attenuation simulation', {
      signalToUse: signalToUse ? `Array of ${signalToUse.length} samples` : 'No signal',
      distance,
      attenuationFactor,
      mediumType,
      availableSignals: {
        noisySignal: noisySignal?.length || 0,
        nrzSignal: nrzSignal?.signal?.length || 0,
        manchesterSignal: manchesterSignal?.signal?.length || 0,
        amiSignal: amiSignal?.signal?.length || 0,
        pseudoternarySignal: pseudoternarySignal?.signal?.length || 0
      }
    });
    
    try {
      if (signalToUse) {
        onUpdateParameters({ distance, attenuationFactor, mediumType });
        const result = onSimulateAttenuation(signalToUse, distance, { attenuationFactor, mediumType });
        console.log('SignalAttenuationStep: Attenuation completed', result);
      } else {
        console.warn('SignalAttenuationStep: No signal available for attenuation');
      }
    } catch (error) {
      console.error('SignalAttenuationStep: Error during attenuation', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleDistanceChange = (newDistance) => {
    setDistance(newDistance);
    // Auto-simulate when distance changes
    setTimeout(() => {
      handleSimulateAttenuation();
    }, 100);
  };

  const handleMediumChange = (medium) => {
    setMediumType(medium);
    const factors = {
      copper: 0.001,   // Copper cable
      fiber: 0.0001,   // Fiber optic (very low attenuation)
      coax: 0.0005,    // Coaxial cable
      wireless: 0.002  // Wireless (free space loss)
    };
    setAttenuationFactor(factors[medium]);
    
    // Automatically re-simulate with new medium
    setTimeout(() => {
      handleSimulateAttenuation();
    }, 100);
  };

  const getComparisonData = () => {
    const originalSignal = getAvailableSignal();
    if (!originalSignal || !attenuatedSignal?.attenuatedSignal) return null;
    
    // Use appropriate time axis based on the signal source
    let timeAxis = [];
    if (noisySignal?.length && originalSignal === noisySignal) {
      // For noisy signal, create a simple time axis
      timeAxis = originalSignal.map((_, index) => index * 0.1);
    } else if (nrzSignal?.timeAxis) {
      timeAxis = nrzSignal.timeAxis;
    } else if (manchesterSignal?.timeAxis) {
      timeAxis = manchesterSignal.timeAxis;
    } else if (amiSignal?.timeAxis) {
      timeAxis = amiSignal.timeAxis;
    } else if (pseudoternarySignal?.timeAxis) {
      timeAxis = pseudoternarySignal.timeAxis;
    } else {
      // Fallback: generate time axis
      timeAxis = originalSignal.map((_, index) => index * 0.1);
    }
    
    return [
      {
        signal: originalSignal,
        timeAxis: timeAxis,
        encoding: 'Original Signal'
      },
      {
        signal: attenuatedSignal.attenuatedSignal,
        timeAxis: timeAxis,
        encoding: 'Attenuated Signal'
      }
    ];
  };

  const comparisonData = getComparisonData();

  return (
    <div className="step-container p-6 bg-white rounded-lg shadow-lg">
      <div className="step-header mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Step 8: Signal Attenuation Simulation
        </h2>
        <p className="text-gray-600">
          Simulate the reduction in signal strength over distance due to various transmission media characteristics.
        </p>
      </div>

      {!getAvailableSignal() && (
        <div className="alert p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
          <p className="text-yellow-800">
            ⚠️ Please complete previous encoding steps (NRZ-L, Manchester, AMI, or Pseudoternary) to have a signal for attenuation simulation.
          </p>
        </div>
      )}

      {getAvailableSignal() && (
        <div className="controls-section mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="attenuation-controls p-4 bg-orange-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-4">Attenuation Parameters</h4>
              
              <div className="control-group mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Distance: {(distance / 1000).toFixed(1)} km
                </label>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={distance}
                  onChange={(e) => handleDistanceChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="medium-type mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Transmission Medium:
                </label>
                <select
                  value={mediumType}
                  onChange={(e) => handleMediumChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="copper">Copper Cable</option>
                  <option value="fiber">Fiber Optic</option>
                  <option value="coax">Coaxial Cable</option>
                  <option value="wireless">Wireless</option>
                </select>
              </div>

              <button
                onClick={handleSimulateAttenuation}
                disabled={isSimulating}
                className="w-full px-4 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium disabled:bg-orange-400 disabled:cursor-not-allowed"
              >
                {isSimulating ? 'Simulating...' : 'Simulate Attenuation'}
              </button>
            </div>

            <div className="attenuation-info p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-4">Attenuation Analysis</h4>
              
              {attenuatedSignal && (
                <div className="metrics space-y-3">
                  <div className="metric-item p-3 bg-white rounded border">
                    <div className="text-sm text-gray-600">Signal Strength</div>
                    <div className="text-lg font-bold text-orange-600">
                      {attenuatedSignal.signalStrength}
                    </div>
                  </div>
                  
                  <div className="metric-item p-3 bg-white rounded border">
                    <div className="text-sm text-gray-600">Attenuation (dB)</div>
                    <div className="text-lg font-bold text-red-600">
                      -{attenuatedSignal.attenuationDb?.toFixed(2)} dB
                    </div>
                  </div>
                  
                  <div className="metric-item p-3 bg-white rounded border">
                    <div className="text-sm text-gray-600">Attenuation Factor</div>
                    <div className="text-lg font-bold text-blue-600">
                      {attenuatedSignal.attenuation?.toFixed(4)}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {comparisonData && (
        <div className="results-section">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Signal Attenuation Comparison
          </h3>
          
          <div className="waveform-container mb-6">
            <WaveformChart
              waveformData={comparisonData}
              title="Original vs Attenuated Signal"
              height={400}
              colors={['#059669', '#DC2626']}
              yAxisLabel="Amplitude (V)"
              xAxisLabel="Time (bit periods)"
            />
          </div>
        </div>
      )}

      <div className="info-section mt-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
        <h4 className="font-medium text-orange-800 mb-2">📉 Signal Attenuation:</h4>
        <div className="text-sm text-orange-700">
          <p>Signal attenuation is the loss of signal strength over distance. Different transmission media have different attenuation characteristics affecting communication range and quality.</p>
        </div>
      </div>
    </div>
  );
};

export default SignalAttenuationStep;