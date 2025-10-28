import React, { useState, useEffect } from 'react';
import WaveformChart from '../WaveformChart';

const NoiseSimulationStep = ({ 
  nrzLSignal,
  nrzISignal, 
  manchesterSignal,
  amiSignal,
  pseudoternarySignal,
  noisySignal, 
  onAddNoise, 
  parameters, 
  onUpdateParameters 
}) => {
  const [noiseLevel, setNoiseLevel] = useState(parameters?.noiseLevel || 0.1);
  const [noiseType, setNoiseType] = useState('gaussian');
  
  // Get the first available signal
  const getAvailableSignal = () => {
    return nrzLSignal?.signal || nrzISignal?.signal || manchesterSignal?.signal || 
           amiSignal?.signal || pseudoternarySignal?.signal || null;
  };
  
  const availableSignal = getAvailableSignal();
  const signalSource = nrzLSignal?.signal ? nrzLSignal : 
                      nrzISignal?.signal ? nrzISignal :
                      manchesterSignal?.signal ? manchesterSignal :
                      amiSignal?.signal ? amiSignal :
                      pseudoternarySignal?.signal ? pseudoternarySignal : null;
  
  useEffect(() => {
    if (availableSignal && !noisySignal?.length) {
      handleAddNoise();
    }
  }, [availableSignal]);

  const handleAddNoise = () => {
    if (availableSignal) {
      onUpdateParameters({ noiseLevel });
      onAddNoise(availableSignal, noiseLevel);
    }
  };

  const handleNoiseChange = (value) => {
    setNoiseLevel(value);
  };

  const handlePreset = (preset) => {
    const presets = {
      low: 0.05,
      medium: 0.15,
      high: 0.3,
      extreme: 0.5
    };
    setNoiseLevel(presets[preset]);
  };

  // Calculate SNR (Signal-to-Noise Ratio)
  const calculateSNR = () => {
    if (!availableSignal || !noisySignal) return null;
    
    const signalPower = availableSignal.reduce((sum, val) => sum + val * val, 0) / availableSignal.length;
    
    const noise = noisySignal.map((noisy, i) => noisy - availableSignal[i]);
    const noisePower = noise.reduce((sum, val) => sum + val * val, 0) / noise.length;
    
    const snr = signalPower / noisePower;
    const snrDb = 10 * Math.log10(snr);
    
    return { snr, snrDb, signalPower, noisePower };
  };

  const snrData = calculateSNR();

  // Prepare comparison data for visualization
  const getComparisonData = () => {
    if (!availableSignal || !noisySignal) return null;
    
    return [
      {
        signal: availableSignal,
        timeAxis: signalSource?.timeAxis || Array.from({length: availableSignal.length}, (_, i) => i),
        encoding: 'Original Signal'
      },
      {
        signal: noisySignal,
        timeAxis: signalSource?.timeAxis || Array.from({length: noisySignal.length}, (_, i) => i),
        encoding: 'Signal with Noise'
      }
    ];
  };

  const comparisonData = getComparisonData();

  return (
    <div className="step-container p-6 bg-white rounded-lg shadow-lg">
      <div className="step-header mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Step 5: Noise Simulation
        </h2>
        <p className="text-gray-600">
          Add realistic noise to the transmitted signal to simulate real-world channel conditions 
          and analyze the impact on signal quality.
        </p>
      </div>

      {!availableSignal && (
        <div className="alert p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
          <p className="text-yellow-800">
            ⚠️ Please complete Steps 1-2 (Frame to Binary and any Encoding step) first.
          </p>
        </div>
      )}

      {availableSignal && (
        <div className="controls-section mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="noise-controls p-4 bg-red-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-4">Noise Configuration</h4>
              
              <div className="control-group mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Noise Level: {(noiseLevel * 100).toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.01"
                  value={noiseLevel}
                  onChange={(e) => handleNoiseChange(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>40%</span>
                  <span>80%</span>
                </div>
              </div>

              <div className="preset-buttons mb-4">
                <div className="grid grid-cols-4 gap-2">
                  <button
                    onClick={() => handlePreset('low')}
                    className="px-3 py-2 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                  >
                    Low (5%)
                  </button>
                  <button
                    onClick={() => handlePreset('medium')}
                    className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded text-sm hover:bg-yellow-200 transition-colors"
                  >
                    Medium (15%)
                  </button>
                  <button
                    onClick={() => handlePreset('high')}
                    className="px-3 py-2 bg-orange-100 text-orange-700 rounded text-sm hover:bg-orange-200 transition-colors"
                  >
                    High (30%)
                  </button>
                  <button
                    onClick={() => handlePreset('extreme')}
                    className="px-3 py-2 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                  >
                    Extreme (50%)
                  </button>
                </div>
              </div>

              <div className="noise-type mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Noise Type:
                </label>
                <select
                  value={noiseType}
                  onChange={(e) => setNoiseType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                >
                  <option value="gaussian">Gaussian (AWGN)</option>
                  <option value="uniform">Uniform</option>
                  <option value="impulse">Impulse</option>
                </select>
              </div>

              <button
                onClick={handleAddNoise}
                className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
              >
                Apply Noise to Signal
              </button>
            </div>

            <div className="signal-info p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-4">Signal Analysis</h4>
              
              {snrData && (
                <div className="metrics-grid grid grid-cols-2 gap-3 mb-4">
                  <div className="metric-card p-3 bg-white rounded border">
                    <div className="text-xs text-gray-600">SNR</div>
                    <div className="text-lg font-bold text-blue-600">
                      {snrData.snrDb.toFixed(1)} dB
                    </div>
                  </div>
                  
                  <div className="metric-card p-3 bg-white rounded border">
                    <div className="text-xs text-gray-600">Signal Power</div>
                    <div className="text-lg font-bold text-green-600">
                      {snrData.signalPower.toFixed(3)}
                    </div>
                  </div>
                  
                  <div className="metric-card p-3 bg-white rounded border">
                    <div className="text-xs text-gray-600">Noise Power</div>
                    <div className="text-lg font-bold text-red-600">
                      {snrData.noisePower.toFixed(3)}
                    </div>
                  </div>
                  
                  <div className="metric-card p-3 bg-white rounded border">
                    <div className="text-xs text-gray-600">Quality</div>
                    <div className={`text-lg font-bold ${
                      snrData.snrDb > 20 ? 'text-green-600' :
                      snrData.snrDb > 10 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {snrData.snrDb > 20 ? 'Excellent' :
                       snrData.snrDb > 10 ? 'Good' : 'Poor'}
                    </div>
                  </div>
                </div>
              )}

              <div className="noise-effects p-3 bg-white rounded border">
                <h5 className="font-medium text-gray-700 mb-2">Expected Effects:</h5>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Signal amplitude variations</li>
                  <li>• Potential bit errors in detection</li>
                  <li>• Reduced signal clarity</li>
                  <li>• Need for error correction</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {comparisonData && (
        <div className="results-section">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Signal Comparison: Before and After Noise
          </h3>
          
          <div className="waveform-container mb-6">
            <WaveformChart
              waveformData={comparisonData}
              title="Original Signal vs Noisy Signal"
              height={400}
              colors={['#10B981', '#EF4444']}
              yAxisLabel="Amplitude (V)"
              xAxisLabel="Time (bit periods)"
              showPoints={false}
            />
          </div>

          <div className="noise-analysis mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Noise Impact Analysis:</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="impact-card p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h5 className="font-medium text-blue-800 mb-2">📊 Statistical Impact</h5>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Peak deviation: ±{(noiseLevel * 100).toFixed(1)}%</li>
                  <li>• RMS noise: {(noiseLevel * 0.707).toFixed(3)}V</li>
                  <li>• Signal degradation: {((1 - 1/(1 + noiseLevel)) * 100).toFixed(1)}%</li>
                </ul>
              </div>
              
              <div className="impact-card p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h5 className="font-medium text-orange-800 mb-2">⚠️ Detection Challenges</h5>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Threshold crossings</li>
                  <li>• Decision errors</li>
                  <li>• Timing jitter</li>
                  <li>• Phase distortion</li>
                </ul>
              </div>
              
              <div className="impact-card p-4 bg-green-50 rounded-lg border border-green-200">
                <h5 className="font-medium text-green-800 mb-2">🛡️ Mitigation Strategies</h5>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Error correction codes</li>
                  <li>• Adaptive thresholds</li>
                  <li>• Signal filtering</li>
                  <li>• Redundant transmission</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="info-section mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
        <h4 className="font-medium text-red-800 mb-2">🔬 Noise in Communication Systems:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-red-700">
          <div>
            <h5 className="font-medium mb-1">Common Noise Sources:</h5>
            <ul className="space-y-1">
              <li>• Thermal noise (Johnson noise)</li>
              <li>• Shot noise in semiconductors</li>
              <li>• Electromagnetic interference (EMI)</li>
              <li>• Crosstalk from adjacent channels</li>
              <li>• Atmospheric noise</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-1">Real-World Considerations:</h5>
            <ul className="space-y-1">
              <li>• Distance affects noise accumulation</li>
              <li>• Frequency-dependent noise characteristics</li>
              <li>• Environmental factors (temperature, humidity)</li>
              <li>• Equipment quality and shielding</li>
              <li>• Power supply noise contribution</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 p-3 bg-white rounded border">
          <h5 className="font-medium text-red-800 mb-1">Performance Metric:</h5>
          <p className="text-sm text-red-700">
            SNR (Signal-to-Noise Ratio) is crucial for determining communication quality. 
            Higher SNR values indicate better signal quality and lower bit error rates.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoiseSimulationStep;