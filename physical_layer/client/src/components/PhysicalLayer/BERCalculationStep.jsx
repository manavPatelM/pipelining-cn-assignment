import React, { useEffect, useState } from 'react';
import { binaryToArray } from '../../utils/physicalLayerUtils';

const BERCalculationStep = ({ 
  binaryData, 
  noisySignal, 
  berResult, 
  receivedSignal, 
  onCalculateBER 
}) => {
  const [threshold, setThreshold] = useState(0);
  const [samplesPerBit, setSamplesPerBit] = useState(10);
  const [errorRate, setErrorRate] = useState(0.05); // 5% bit flip probability
  const [receivedBitString, setReceivedBitString] = useState('');
  const [useManualBits, setUseManualBits] = useState(false);

  useEffect(() => {
    if (binaryData && !berResult) {
      generateBitsWithErrors();
    }
  }, [binaryData, errorRate]);

  const generateBitsWithErrors = () => {
    if (!binaryData) return;
    
    const originalBits = binaryData.split('');
    const receivedBits = originalBits.map(bit => {
      // Flip bit with error probability
      if (Math.random() < errorRate) {
        return bit === '1' ? '0' : '1';
      }
      return bit;
    });
    
    const receivedString = receivedBits.join('');
    setReceivedBitString(receivedString);
    
    if (onCalculateBER) {
      onCalculateBER(binaryData, receivedString);
    }
  };

  const handleErrorRateChange = (newRate) => {
    setErrorRate(newRate);
    if (!useManualBits) {
      generateBitsWithErrors();
    }
  };

  const handleManualBitChange = (bitIndex, newValue) => {
    if (!binaryData) return;
    
    const bits = receivedBitString.split('');
    bits[bitIndex] = newValue;
    const newBitString = bits.join('');
    setReceivedBitString(newBitString);
    
    if (onCalculateBER) {
      onCalculateBER(binaryData, newBitString);
    }
  };

  const handleRecalculateBER = () => {
    if (useManualBits) {
      if (onCalculateBER) {
        onCalculateBER(binaryData, receivedBitString);
      }
    } else {
      generateBitsWithErrors();
    }
  };

  // Get bit comparison for visualization
  const getBitComparison = () => {
    if (!binaryData || !receivedSignal) return [];
    
    const originalBits = binaryData.split('').map(bit => parseInt(bit));
    const comparison = [];
    
    for (let i = 0; i < Math.min(originalBits.length, receivedSignal.length); i++) {
      comparison.push({
        index: i,
        original: originalBits[i],
        received: receivedSignal[i],
        error: originalBits[i] !== receivedSignal[i]
      });
    }
    
    return comparison;
  };

  const bitComparison = getBitComparison();

  // Helper functions for quality assessment
  const getQualityLabel = () => {
    if (!berResult || typeof berResult.ber !== 'number') return 'Unknown';
    if (berResult.ber < 0.001) return 'Excellent';
    if (berResult.ber < 0.01) return 'Good';
    if (berResult.ber < 0.1) return 'Fair';
    return 'Poor';
  };

  const getQualityColor = () => {
    if (!berResult || typeof berResult.ber !== 'number') return 'bg-gray-400';
    if (berResult.ber < 0.001) return 'bg-green-500';
    if (berResult.ber < 0.01) return 'bg-blue-500';
    if (berResult.ber < 0.1) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getQualityDescription = () => {
    if (!berResult || typeof berResult.ber !== 'number') return 'Unable to determine quality';
    if (berResult.ber < 0.001) return 'Outstanding transmission quality';
    if (berResult.ber < 0.01) return 'Good transmission quality';
    if (berResult.ber < 0.1) return 'Acceptable for some applications';
    return 'Requires immediate attention';
  };

  return (
    <div className="step-container p-6 bg-white rounded-lg shadow-lg">
      <div className="step-header mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Step 6: Bit Error Rate (BER) Calculation
        </h2>
        <p className="text-gray-600">
          Calculate the bit error rate by comparing the original transmitted bits 
          with the received bits after noise corruption and signal detection.
        </p>
      </div>

      {(!binaryData) && (
        <div className="alert p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
          <p className="text-yellow-800">
            ⚠️ Please complete Step 1 (Frame to Binary Conversion) first.
          </p>
        </div>
      )}

      {binaryData && (
        <div className="controls-section mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="ber-controls p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-4">BER Simulation Parameters</h4>
              
              <div className="control-group mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Simulation Mode:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mode"
                      checked={!useManualBits}
                      onChange={() => setUseManualBits(false)}
                      className="mr-2"
                    />
                    <span className="text-sm">Automatic Error Injection</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="mode"
                      checked={useManualBits}
                      onChange={() => setUseManualBits(true)}
                      className="mr-2"
                    />
                    <span className="text-sm">Manual Bit Editing</span>
                  </label>
                </div>
              </div>

              {!useManualBits && (
                <div className="control-group mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Error Rate: {(errorRate * 100).toFixed(1)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="0.5"
                    step="0.01"
                    value={errorRate}
                    onChange={(e) => handleErrorRateChange(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                  </div>
                </div>
              )}

              <button
                onClick={handleRecalculateBER}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
              >
                {useManualBits ? 'Recalculate BER' : 'Generate New Errors'}
              </button>
            </div>

            <div className="bit-display p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-4">Bit Comparison</h4>
              
              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-600 mb-2">Original Binary:</h5>
                <div className="font-mono text-xs bg-white p-3 rounded border overflow-x-auto">
                  {binaryData?.split('').map((bit, index) => (
                    <span
                      key={index}
                      className={`inline-block w-6 text-center ${
                        bit === '1' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      } mr-1 mb-1 rounded`}
                    >
                      {bit}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <h5 className="text-sm font-medium text-gray-600 mb-2">Received Binary:</h5>
                <div className="font-mono text-xs bg-white p-3 rounded border overflow-x-auto">
                  {receivedBitString.split('').map((bit, index) => {
                    const isError = binaryData && bit !== binaryData[index];
                    return (
                      <span
                        key={index}
                        className={`inline-block w-6 text-center mr-1 mb-1 rounded cursor-pointer ${
                          isError 
                            ? 'bg-yellow-300 text-yellow-900 font-bold' 
                            : bit === '1' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                        }`}
                        onClick={() => useManualBits && handleManualBitChange(index, bit === '1' ? '0' : '1')}
                        title={useManualBits ? 'Click to flip bit' : ''}
                      >
                        {bit}
                      </span>
                    );
                  })}
                </div>
                {useManualBits && (
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Click on any bit to flip it manually
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {berResult && (
        <div className="results-section mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="ber-metrics p-6 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
              <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                BER Analysis
              </h4>
              
              <div className="metrics-grid space-y-4">
                <div className="metric-item p-4 bg-white rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Total Bits:</span>
                    <span className="text-lg font-bold text-blue-600">{berResult.totalBits}</span>
                  </div>
                </div>
                
                <div className="metric-item p-4 bg-white rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Error Bits:</span>
                    <span className="text-lg font-bold text-red-600">{berResult.errorBits}</span>
                  </div>
                </div>
                
                <div className="metric-item p-4 bg-white rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">BER:</span>
                    <span className="text-xl font-bold text-purple-600">
                      {typeof berResult.ber === 'number' ? berResult.ber.toExponential(3) : 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="metric-item p-4 bg-white rounded-lg shadow-sm border">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Error Rate:</span>
                    <span className="text-lg font-bold text-orange-600">
                      {typeof berResult.ber === 'number' ? (berResult.ber * 100).toFixed(3) : '0'}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="ber-quality p-6 bg-gradient-to-r from-green-50 to-teal-50 rounded-lg border border-green-200">
              <h4 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-2xl">📈</span>
                Quality Assessment
              </h4>
              
              <div className="quality-indicators space-y-4">
                <div className="quality-item p-4 bg-white rounded-lg shadow-sm border">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${getQualityColor()}`}></div>
                    <div>
                      <div className="font-medium text-gray-700">
                        Link Quality: {getQualityLabel()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getQualityDescription()}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="performance-bars space-y-3">
                  <div className="performance-item">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">Accuracy</span>
                      <span className="text-sm text-gray-600">
                        {typeof berResult.ber === 'number' ? ((1 - berResult.ber) * 100).toFixed(2) : '100'}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${typeof berResult.ber === 'number' ? (1 - berResult.ber) * 100 : 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                  
                  <div className="performance-item">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-600">Error Rate</span>
                      <span className="text-sm text-gray-600">
                        {typeof berResult.ber === 'number' ? (berResult.ber * 100).toFixed(3) : '0'}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-600 h-2 rounded-full transition-all duration-500"
                        style={{
                          width: `${typeof berResult.ber === 'number' ? Math.min(berResult.ber * 100, 100) : 0}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="info-section mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-2">📈 Understanding BER:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <h5 className="font-medium mb-1">BER Calculation:</h5>
            <ul className="space-y-1">
              <li>• BER = Number of Error Bits / Total Number of Bits</li>
              <li>• Expressed as a ratio or percentage</li>
              <li>• Lower values indicate better performance</li>
              <li>• Depends on SNR, modulation, and channel conditions</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-1">Typical BER Requirements:</h5>
            <ul className="space-y-1">
              <li>• Voice: 10⁻³ (0.1%)</li>
              <li>• Data: 10⁻⁶ (0.0001%)</li>
              <li>• Fiber optic: 10⁻⁹ (0.0000001%)</li>
              <li>• Satellite: 10⁻⁷ (0.00001%)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BERCalculationStep;