import React, { useState, useEffect } from 'react';
import WaveformChart from '../WaveformChart';
import BinaryInputSection from './BinaryInputSection';
import { binaryToArray, validateBinaryInput } from '../../utils/physicalLayerUtils';

// NRZI Encoding function
const nrzIEncoding = (bits, samplesPerBit = 20) => {
  const signal = [];
  const timeAxis = [];
  const bitDuration = 1;
  let currentLevel = 1; // Start with high level
  
  bits.forEach((bit, index) => {
    // For '1' bits, invert the level
    if (bit === 1) {
      currentLevel = currentLevel === 1 ? -1 : 1;
    }
    // For '0' bits, maintain current level
    
    for (let i = 0; i < samplesPerBit; i++) {
      const time = index * bitDuration + (i / samplesPerBit) * bitDuration;
      timeAxis.push(time);
      signal.push(currentLevel);
    }
  });
  
  return { signal, timeAxis, encoding: 'NRZI' };
};

const NRZIEncodingStep = ({ binaryData, nrzISignal, onNRZIEncode }) => {
  const [samplesPerBit, setSamplesPerBit] = useState(20);
  const [signalData, setSignalData] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [customSignalData, setCustomSignalData] = useState(null);
  const [activeTab, setActiveTab] = useState('pipeline');

  useEffect(() => {
    if (binaryData && typeof binaryData === 'string' && binaryData.length > 0) {
      const bits = binaryToArray(binaryData);
      const encoded = nrzIEncoding(bits, samplesPerBit);
      setSignalData(encoded);
      if (onNRZIEncode) {
        onNRZIEncode(binaryData, samplesPerBit);
      }
    }
  }, [binaryData, samplesPerBit, onNRZIEncode]);

  // Also use nrzISignal from props if available
  useEffect(() => {
    if (nrzISignal && nrzISignal.signal && nrzISignal.signal.length > 0) {
      setSignalData(nrzISignal);
    }
  }, [nrzISignal]);

  const handleRegenerate = () => {
    if (binaryData) {
      const bits = binaryToArray(binaryData);
      const encoded = nrzIEncoding(bits, samplesPerBit);
      setSignalData(encoded);
      onNRZIEncode && onNRZIEncode(binaryData, samplesPerBit);
    }
  };

  const handleUserInputChange = (cleanedInput) => {
    const bits = binaryToArray(cleanedInput);
    const encoded = nrzIEncoding(bits, samplesPerBit);
    setCustomSignalData({ ...encoded, binaryInput: cleanedInput });
  };

  const handleCustomEncode = () => {
    const validation = validateBinaryInput(userInput);
    if (validation.isValid) {
      setInputError('');
      const bits = binaryToArray(validation.cleanedInput);
      const encoded = nrzIEncoding(bits, samplesPerBit);
      setCustomSignalData(encoded);
    } else {
      setInputError(validation.error);
    }
  };

  // Calculate transition pattern for display
  const getTransitionPattern = () => {
    if (!binaryData) return [];
    
    const transitions = [];
    let currentLevel = 1; // Start with high level
    
    binaryData.split('').forEach((bit, index) => {
      if (bit === '1') {
        currentLevel = currentLevel === 1 ? -1 : 1; // Invert for '1'
        transitions.push({ index, bit, action: 'Transition', level: currentLevel });
      } else {
        transitions.push({ index, bit, action: 'No Change', level: currentLevel });
      }
    });
    
    return transitions;
  };

  const transitionPattern = getTransitionPattern();

  return (
    <div className="step-container p-6 bg-white rounded-lg shadow-lg">
      <div className="step-header mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Step 4: Non-Return-to-Zero Inverted (NRZI) Encoding
        </h2>
        <p className="text-gray-600">
          Convert binary data to NRZI line coding where '1' causes a signal level transition 
          and '0' maintains the current signal level.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`tab-button px-4 py-2 font-medium text-sm ${
              activeTab === 'pipeline'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pipeline')}
          >
            Pipeline Data
          </button>
          <button
            className={`tab-button px-4 py-2 font-medium text-sm ${
              activeTab === 'custom'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('custom')}
          >
            Custom Input
          </button>
        </div>
      </div>

      {/* Pipeline Data Tab */}
      {activeTab === 'pipeline' && (
        <div className="pipeline-section">
          {(!binaryData || binaryData.length === 0) ? (
            <div className="no-data-message p-8 text-center">
              <div className="text-gray-400 text-lg mb-2">⏳</div>
              <p className="text-gray-600">
                Waiting for binary data from previous steps...
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Complete frame to binary conversion to see NRZI encoding
              </p>
            </div>
          ) : (
            <div className="encoding-content">
              <div className="data-display mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Input Binary Data:</div>
                <div className="font-mono text-lg text-indigo-600 break-all">
                  {binaryData}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Length: {binaryData.length} bits
                </div>
                <div className="mt-3">
                  <button
                    onClick={handleRegenerate}
                    className="regenerate-btn px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    🔄 Generate NRZI Encoding
                  </button>
                </div>
              </div>

              {(signalData || nrzISignal) && (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    NRZI Encoded Signal
                  </h3>
                  
                  <div className="waveform-container mb-6">
                    <WaveformChart
                      waveformData={signalData || nrzISignal}
                      title="NRZI (Non-Return-to-Zero Inverted) Encoding"
                      height={350}
                      colors={['#6366F1']}
                      yAxisLabel="Voltage (V)"
                      xAxisLabel="Time (bit periods)"
                    />
                  </div>

                  <div className="analysis-grid grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="stat-card p-4 bg-white rounded-lg border">
                      <div className="text-sm text-gray-600">Total Bits</div>
                      <div className="text-2xl font-bold text-indigo-600">
                        {binaryData?.length || 0}
                      </div>
                    </div>
                    
                    <div className="stat-card p-4 bg-white rounded-lg border">
                      <div className="text-sm text-gray-600">Transitions ('1's)</div>
                      <div className="text-2xl font-bold text-green-600">
                        {(binaryData?.match(/1/g) || []).length}
                      </div>
                    </div>
                    
                    <div className="stat-card p-4 bg-white rounded-lg border">
                      <div className="text-sm text-gray-600">No Changes ('0's)</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {(binaryData?.match(/0/g) || []).length}
                      </div>
                    </div>
                    
                    <div className="stat-card p-4 bg-white rounded-lg border">
                      <div className="text-sm text-gray-600">Signal Samples</div>
                      <div className="text-2xl font-bold text-orange-600">
                        {(signalData || nrzISignal)?.signal?.length || 0}
                      </div>
                    </div>
                  </div>

                  <div className="transition-mapping mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Bit-to-Transition Mapping:</h4>
                    <div className="mapping-display p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-auto gap-2 max-h-40 overflow-y-auto">
                        {transitionPattern.map((item, index) => (
                          <div key={index} className="mapping-item flex items-center gap-2 text-sm">
                            <span className="bit-index text-gray-500 w-8">
                              {index}:
                            </span>
                            <span className={`bit-value w-6 text-center ${
                              item.bit === '1' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                            } rounded`}>
                              {item.bit}
                            </span>
                            <span className="arrow text-gray-400">→</span>
                            <span className={`action w-20 text-center ${
                              item.action === 'Transition' ? 'text-green-600' : 'text-blue-600'
                            } font-mono text-xs`}>
                              {item.action}
                            </span>
                            <span className={`level w-12 text-center ${
                              item.level === 1 ? 'text-green-600' : 'text-red-600'
                            } font-mono text-xs`}>
                              {item.level === 1 ? '+1V' : '-1V'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Custom Input Tab */}
      {activeTab === 'custom' && (
        <div className="custom-section">
          <div className="mb-6">
            <BinaryInputSection
              userInput={userInput}
              setUserInput={setUserInput}
              inputError={inputError}
              setInputError={setInputError}
              onValidInput={handleUserInputChange}
              title="Custom Binary Input for NRZI"
            />
          </div>

          <div className="controls-section mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <div className="control-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Samples per Bit:
                </label>
                <input
                  type="range"
                  min="10"
                  max="50"
                  value={samplesPerBit}
                  onChange={(e) => setSamplesPerBit(parseInt(e.target.value))}
                  className="w-32"
                />
                <span className="ml-2 text-sm text-gray-600">{samplesPerBit}</span>
              </div>
              
              <button
                onClick={handleCustomEncode}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Encode Custom Input
              </button>
            </div>
          </div>
          
          {customSignalData && (
            <div className="custom-results mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Custom NRZI Encoded Signal
              </h3>
              
              <div className="waveform-container mb-6">
                <WaveformChart
                  waveformData={customSignalData}
                  title="Custom NRZI Encoding"
                  height={350}
                  colors={['#4F46E5']}
                  yAxisLabel="Voltage (V)"
                  xAxisLabel="Time (bit periods)"
                />
              </div>

              {/* Display binary sequence under waveform */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">Binary Sequence:</h4>
                <div className="font-mono text-lg">
                  {userInput.replace(/\s+/g, '').split('').map((bit, index) => (
                    <span
                      key={index}
                      className={`inline-block w-8 h-8 text-center leading-8 mr-1 mb-1 rounded ${
                        bit === '1' 
                          ? 'bg-green-500 text-white' 
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {bit}
                    </span>
                  ))}
                </div>
              </div>

              <div className="analysis-grid grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="stat-card p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600">Input Bits</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {customSignalData?.binaryInput?.length || 0}
                  </div>
                </div>
                
                <div className="stat-card p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600">Transitions</div>
                  <div className="text-2xl font-bold text-green-600">
                    {(customSignalData?.binaryInput?.match(/1/g) || []).length}
                  </div>
                </div>
                
                <div className="stat-card p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600">No Changes</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {(customSignalData?.binaryInput?.match(/0/g) || []).length}
                  </div>
                </div>
                
                <div className="stat-card p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600">Differential</div>
                  <div className="text-2xl font-bold text-indigo-600">
                    ✓
                  </div>
                  <div className="text-xs text-gray-500">Encoding</div>
                </div>
              </div>

              {customSignalData?.binaryInput && (
                <div className="custom-mapping mb-6">
                  <h4 className="font-medium text-gray-700 mb-3">Custom Input Mapping:</h4>
                  <div className="mapping-display p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-auto gap-2 max-h-40 overflow-y-auto">
                      {(() => {
                        const transitions = [];
                        let currentLevel = 1;
                        customSignalData.binaryInput.split('').forEach((bit, index) => {
                          if (bit === '1') {
                            currentLevel = currentLevel === 1 ? -1 : 1;
                            transitions.push({ index, bit, action: 'Transition', level: currentLevel });
                          } else {
                            transitions.push({ index, bit, action: 'No Change', level: currentLevel });
                          }
                        });
                        return transitions;
                      })().map((item, index) => (
                        <div key={index} className="mapping-item flex items-center gap-2 text-sm">
                          <span className="bit-index text-gray-500 w-8">
                            {index}:
                          </span>
                          <span className={`bit-value w-6 text-center ${
                            item.bit === '1' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                          } rounded`}>
                            {item.bit}
                          </span>
                          <span className="arrow text-gray-400">→</span>
                          <span className={`action w-20 text-center ${
                            item.action === 'Transition' ? 'text-green-600' : 'text-blue-600'
                          } font-mono text-xs`}>
                            {item.action}
                          </span>
                          <span className={`level w-12 text-center ${
                            item.level === 1 ? 'text-green-600' : 'text-red-600'
                          } font-mono text-xs`}>
                            {item.level === 1 ? '+1V' : '-1V'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="info-section mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
        <h4 className="font-medium text-indigo-800 mb-2">🔄 NRZI Encoding Characteristics:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-indigo-700">
          <div>
            <h5 className="font-medium mb-1">Advantages:</h5>
            <ul className="space-y-1">
              <li>• Immune to polarity inversion</li>
              <li>• Same bandwidth as NRZ</li>
              <li>• Simple implementation</li>
              <li>• Better sync than NRZ for 1s</li>
              <li>• Differential encoding benefits</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-1">Disadvantages:</h5>
            <ul className="space-y-1">
              <li>• DC component still present</li>
              <li>• Problems with long sequences of 0s</li>
              <li>• No self-synchronization</li>
              <li>• Baseline wander issues</li>
              <li>• Requires clock recovery</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 p-3 bg-white rounded border">
          <h5 className="font-medium text-indigo-800 mb-1">Key Insight:</h5>
          <p className="text-sm text-indigo-700">
            NRZI encoding is particularly useful in systems where polarity might be inverted, 
            as the information is carried in the transitions rather than the absolute levels.
          </p>
        </div>
      </div>

      <div className="technical-details mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">NRZI Encoding Rules:</h4>
        <div className="text-sm text-gray-700">
          <ul className="space-y-1">
            <li>• Binary '1' → Change signal level (transition)</li>
            <li>• Binary '0' → Maintain current level (no change)</li>
            <li>• Starts with +1V (high level)</li>
            <li>• Differential encoding scheme</li>
            <li>• Used in USB and some fiber optic systems</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NRZIEncodingStep;