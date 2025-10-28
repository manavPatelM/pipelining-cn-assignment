import React, { useState, useEffect } from 'react';
import WaveformChart from '../WaveformChart';
import BinaryInputSection from './BinaryInputSection';
import { binaryToArray, amiEncoding, validateBinaryInput } from '../../utils/physicalLayerUtils';

const AMIEncodingStep = ({ 
  binaryData, 
  amiSignal, 
  onAMIEncode, 
  parameters, 
  onUpdateParameters 
}) => {
  const [samplesPerBit, setSamplesPerBit] = useState(20);
  const [signalData, setSignalData] = useState(null);
  const [customSignalData, setCustomSignalData] = useState(null);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [userInput, setUserInput] = useState('');
  const [inputError, setInputError] = useState('');

  useEffect(() => {
    if (binaryData && typeof binaryData === 'string' && binaryData.length > 0) {
      const bits = binaryToArray(binaryData);
      const encoded = amiEncoding(bits, samplesPerBit);
      setSignalData(encoded);
      if (onAMIEncode) {
        onAMIEncode(binaryData, samplesPerBit);
      }
    }
  }, [binaryData, samplesPerBit, onAMIEncode]);

  // Prefer context-provided signal if available
  useEffect(() => {
    if (amiSignal && amiSignal.signal && amiSignal.signal.length > 0) {
      setSignalData(amiSignal);
    }
  }, [amiSignal]);

  const handleParameterChange = (param, value) => {
    if (param === 'samplesPerBit') {
      setSamplesPerBit(parseInt(value));
    }
    if (onUpdateParameters) {
      onUpdateParameters({ [param]: value });
    }
  };

  const handleUserInputChange = (cleanedInput) => {
    const bits = binaryToArray(cleanedInput);
    const encoded = amiEncoding(bits, samplesPerBit);
    setCustomSignalData({ ...encoded, binaryInput: cleanedInput });
  };

  const handleCustomEncode = () => {
    const validation = validateBinaryInput(userInput);
    if (validation.isValid) {
      setInputError('');
      const bits = binaryToArray(validation.cleanedInput);
      const encoded = amiEncoding(bits, samplesPerBit);
      setCustomSignalData(encoded);
    } else {
      setInputError(validation.error);
    }
  };

  const handleRegenerate = () => {
    if (binaryData) {
      const bits = binaryToArray(binaryData);
      const encoded = amiEncoding(bits, samplesPerBit);
      setSignalData(encoded);
      onAMIEncode && onAMIEncode(binaryData, samplesPerBit);
    }
  };

  // Calculate AMI pattern for display
  const getAMIPattern = () => {
    if (!binaryData) return [];
    
    const pattern = [];
    let lastPolarity = 1; // Start with positive for first '1'
    
    binaryData.split('').forEach((bit, index) => {
      if (bit === '1') {
        pattern.push({ index, bit, level: lastPolarity, action: 'Mark' });
        lastPolarity = -lastPolarity; // Alternate polarity for next '1'
      } else {
        pattern.push({ index, bit, level: 0, action: 'Space' });
      }
    });
    
    return pattern;
  };

  const amiPattern = getAMIPattern();

  return (
    <div className="step-container p-6 bg-white rounded-lg shadow-lg">
      <div className="step-header mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Step 5: AMI Encoding
        </h2>
        <p className="text-gray-600">
          Alternate Mark Inversion (AMI) encoding represents binary 0 as zero voltage 
          and binary 1 as alternating positive and negative voltages.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`tab-button px-4 py-2 font-medium text-sm ${
              activeTab === 'pipeline'
                ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pipeline')}
          >
            Pipeline Data
          </button>
          <button
            className={`tab-button px-4 py-2 font-medium text-sm ${
              activeTab === 'custom'
                ? 'text-amber-600 border-b-2 border-amber-600 bg-amber-50'
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
                Complete frame to binary conversion to see AMI encoding
              </p>
            </div>
          ) : (
            <div className="encoding-content">
              <div className="data-display mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Input Binary Data:</div>
                <div className="font-mono text-lg text-amber-600 break-all">
                  {binaryData}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Length: {binaryData.length} bits
                </div>
                <div className="mt-3">
                  <button
                    onClick={handleRegenerate}
                    className="regenerate-btn px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    🔄 Generate AMI Encoding
                  </button>
                </div>
              </div>

              {(signalData || amiSignal) && (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    AMI Encoded Signal
                  </h3>
                  
                  <div className="waveform-container mb-6">
                    <WaveformChart
                      waveformData={signalData || amiSignal}
                      title="AMI Encoding Visualization"
                      height={350}
                      colors={["#8B4513"]}
                      yAxisLabel="Amplitude (V)"
                      xAxisLabel="Time (bit periods)"
                    />
                  </div>

                  <div className="analysis-grid grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="stat-card p-4 bg-white rounded-lg border">
                      <div className="text-sm text-gray-600">Total Bits</div>
                      <div className="text-2xl font-bold text-amber-600">
                        {binaryData?.length || 0}
                      </div>
                    </div>
                    
                    <div className="stat-card p-4 bg-white rounded-lg border">
                      <div className="text-sm text-gray-600">Marks ('1's)</div>
                      <div className="text-2xl font-bold text-green-600">
                        {(binaryData?.match(/1/g) || []).length}
                      </div>
                    </div>
                    
                    <div className="stat-card p-4 bg-white rounded-lg border">
                      <div className="text-sm text-gray-600">Spaces ('0's)</div>
                      <div className="text-2xl font-bold text-blue-600">
                        {(binaryData?.match(/0/g) || []).length}
                      </div>
                    </div>
                    
                    <div className="stat-card p-4 bg-white rounded-lg border">
                      <div className="text-sm text-gray-600">DC Component</div>
                      <div className="text-2xl font-bold text-green-600">
                        0V
                      </div>
                      <div className="text-xs text-gray-500">Balanced</div>
                    </div>
                  </div>

                  <div className="ami-mapping mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">AMI Bit Mapping:</h4>
                    <div className="mapping-display p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-auto gap-2 max-h-40 overflow-y-auto">
                        {amiPattern.map((item, index) => (
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
                            <span className={`action w-12 text-center ${
                              item.action === 'Mark' ? 'text-green-600' : 'text-blue-600'
                            } font-mono text-xs`}>
                              {item.action}
                            </span>
                            <span className={`level w-12 text-center ${
                              item.level === 1 ? 'text-green-600' : 
                              item.level === -1 ? 'text-red-600' : 'text-gray-600'
                            } font-mono text-xs`}>
                              {item.level === 1 ? '+1V' : item.level === -1 ? '-1V' : '0V'}
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
              title="Custom Binary Input for AMI"
            />
          </div>

          <div className="mb-6">
            <button
              onClick={handleCustomEncode}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Encode Custom Input
            </button>
          </div>
          
          {customSignalData && (
            <div className="custom-results mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Custom AMI Encoded Signal
              </h3>
              
              <div className="waveform-container mb-6">
                <WaveformChart
                  waveformData={customSignalData}
                  title="Custom AMI Encoding"
                  height={350}
                  colors={["#92400E"]}
                  yAxisLabel="Amplitude (V)"
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
                  <div className="text-2xl font-bold text-amber-600">
                    {customSignalData?.binaryInput?.length || 0}
                  </div>
                </div>
                
                <div className="stat-card p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600">Marks</div>
                  <div className="text-2xl font-bold text-green-600">
                    {(customSignalData?.binaryInput?.match(/1/g) || []).length}
                  </div>
                </div>
                
                <div className="stat-card p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600">Spaces</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {(customSignalData?.binaryInput?.match(/0/g) || []).length}
                  </div>
                </div>
                
                <div className="stat-card p-4 bg-white rounded-lg border">
                  <div className="text-sm text-gray-600">Alternating</div>
                  <div className="text-2xl font-bold text-amber-600">
                    ✓
                  </div>
                  <div className="text-xs text-gray-500">Marks</div>
                </div>
              </div>

              {customSignalData?.binaryInput && (
                <div className="custom-mapping mb-6">
                  <h4 className="font-medium text-gray-700 mb-3">Custom Input Mapping:</h4>
                  <div className="mapping-display p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-auto gap-2 max-h-40 overflow-y-auto">
                      {(() => {
                        const pattern = [];
                        let lastPolarity = 1;
                        customSignalData.binaryInput.split('').forEach((bit, index) => {
                          if (bit === '1') {
                            pattern.push({ index, bit, level: lastPolarity, action: 'Mark' });
                            lastPolarity = -lastPolarity;
                          } else {
                            pattern.push({ index, bit, level: 0, action: 'Space' });
                          }
                        });
                        return pattern;
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
                          <span className={`action w-12 text-center ${
                            item.action === 'Mark' ? 'text-green-600' : 'text-blue-600'
                          } font-mono text-xs`}>
                            {item.action}
                          </span>
                          <span className={`level w-12 text-center ${
                            item.level === 1 ? 'text-green-600' : 
                            item.level === -1 ? 'text-red-600' : 'text-gray-600'
                          } font-mono text-xs`}>
                            {item.level === 1 ? '+1V' : item.level === -1 ? '-1V' : '0V'}
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

      <div className="info-section mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <h4 className="font-medium text-amber-800 mb-2">⚖️ AMI Encoding Characteristics:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-700">
          <div>
            <h5 className="font-medium mb-1">Advantages:</h5>
            <ul className="space-y-1">
              <li>• No DC component (balanced)</li>
              <li>• Built-in error detection</li>
              <li>• Self-synchronizing for 1s</li>
              <li>• Simple implementation</li>
              <li>• Natural spectral shaping</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-1">Disadvantages:</h5>
            <ul className="space-y-1">
              <li>• Problems with long 0 sequences</li>
              <li>• No synchronization for 0s</li>
              <li>• Lower power efficiency</li>
              <li>• Requires three signal levels</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 p-3 bg-white rounded border">
          <h5 className="font-medium text-amber-800 mb-1">Common Applications:</h5>
          <p className="text-sm text-amber-700">
            T1 and E1 digital telephony systems, some fiber optic communications, and older digital transmission systems.
          </p>
        </div>
      </div>

      <div className="technical-details mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">AMI Encoding Rules:</h4>
        <div className="text-sm text-gray-700">
          <ul className="space-y-1">
            <li>• Binary '0' is represented by zero voltage (0V)</li>
            <li>• Binary '1' alternates between positive and negative voltage</li>
            <li>• First '1' might be +1V, second '1' is -1V, third is +1V, etc.</li>
            <li>• No DC component due to alternating voltages</li>
            <li>• Violation of alternation indicates transmission error</li>
            <li>• Used in digital telephony (T1/E1 lines)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AMIEncodingStep;