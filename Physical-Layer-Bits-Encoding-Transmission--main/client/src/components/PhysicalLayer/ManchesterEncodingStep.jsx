import React, { useState, useEffect } from 'react';
import WaveformChart from '../WaveformChart';
import BinaryInputSection from './BinaryInputSection';
import { binaryToArray, manchesterEncoding, validateBinaryInput } from '../../utils/physicalLayerUtils';

const ManchesterEncodingStep = ({ binaryData, manchesterSignal, onManchesterEncode }) => {
  const [samplesPerBit, setSamplesPerBit] = useState(20);
  const [signalData, setSignalData] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [customSignalData, setCustomSignalData] = useState(null);
  const [activeTab, setActiveTab] = useState('pipeline');

  useEffect(() => {
    if (binaryData && typeof binaryData === 'string' && binaryData.length > 0) {
      const bits = binaryToArray(binaryData);
      const encoded = manchesterEncoding(bits, samplesPerBit);
      setSignalData(encoded);
      if (onManchesterEncode) {
        onManchesterEncode(binaryData, samplesPerBit);
      }
    }
  }, [binaryData, samplesPerBit, onManchesterEncode]);

  useEffect(() => {
    if (manchesterSignal && manchesterSignal.signal && manchesterSignal.signal.length > 0) {
      setSignalData(manchesterSignal);
    }
  }, [manchesterSignal]);

  const handleRegenerate = () => {
    if (binaryData && onManchesterEncode) {
      const bits = binaryToArray(binaryData);
      const encoded = manchesterEncoding(bits, samplesPerBit);
      setSignalData(encoded);
      onManchesterEncode(binaryData, samplesPerBit);
    }
  };

  const handleUserInputChange = (cleanedInput) => {
    const bits = binaryToArray(cleanedInput);
    const encoded = manchesterEncoding(bits, samplesPerBit);
    setCustomSignalData(encoded);
  };

  const handleCustomEncode = () => {
    const validation = validateBinaryInput(userInput);
    if (validation.isValid) {
      setInputError('');
      const bits = binaryToArray(validation.cleanedInput);
      const encoded = manchesterEncoding(bits, samplesPerBit);
      setCustomSignalData(encoded);
    } else {
      setInputError(validation.error);
    }
  };

  return (
    <div className="step-container p-6 bg-white rounded-lg shadow-lg">
      <div className="step-header mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Step 3: Manchester Encoding
        </h2>
        <p className="text-gray-600">
          Apply Manchester encoding with guaranteed transitions for clock recovery
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="tabs-container mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`tab-button px-4 py-2 font-medium text-sm ${
              activeTab === 'pipeline'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('pipeline')}
          >
            Manchester
          </button>
          <button
  className={`tab-button px-4 py-2 font-medium text-sm ${
    activeTab === 'diff'
      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
      : 'text-gray-500 hover:text-gray-700'
  }`}
  onClick={() => setActiveTab('diff')}
>
  Differential Manchester
</button>
          <button
            className={`tab-button px-4 py-2 font-medium text-sm ${
              activeTab === 'custom'
                ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
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
                Complete frame to binary conversion to see Manchester encoding
              </p>
            </div>
          ) : (
            <div className="encoding-content">
              <div className="controls-section mb-6">
                <div className="flex flex-wrap items-center gap-4">
                  {/* <div className="control-group">
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
                  </div> */}
                  
                  {/* <button
                    onClick={handleRegenerate}
                    className="regenerate-btn px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    🔄 Regenerate
                  </button> */}
                </div>
              </div>

              <div className="data-display mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Input Binary Data:</div>
                <div className="font-mono text-lg text-purple-600 break-all">
                  {binaryData}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Length: {binaryData.length} bits
                </div>
              </div>

              {signalData && (
                <>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    Manchester Encoded Signal (IEEE 802.3 Standard)
                  </h3>
                  
                  <div className="waveform-container mb-6">
                    <WaveformChart
                      waveformData={signalData}
                      title="Manchester Encoding (IEEE 802.3)"
                      height={350}
                      colors={['#9333EA']}
                      yAxisLabel="Voltage (V)"
                      xAxisLabel="Time (bit periods)"
                    />
                  </div>

                  <div className="analysis-grid grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <div className="stat-card p-4 bg-white rounded-lg border text-center">
    <div className="text-sm text-gray-600">Total Bits</div>
    <div className="text-2xl font-bold text-purple-600">
      {binaryData?.length || 0}
    </div>
  </div>

  <div className="stat-card p-4 bg-white rounded-lg border text-center">
    <div className="text-sm text-gray-600">Transitions</div>
    <div className="text-2xl font-bold text-blue-600">
      {binaryData?.length || 0}
    </div>
  </div>

  <div className="stat-card p-4 bg-white rounded-lg border text-center">
    <div className="text-sm text-gray-600">Bandwidth</div>
    <div className="text-2xl font-bold text-orange-600">
      2x
    </div>
    <div className="text-xs text-gray-500">vs NRZ</div>
  </div>
</div>


                  <div className="bit-mapping mb-6">
                    <h4 className="font-medium text-gray-700 mb-3">Bit-to-Transition Mapping:</h4>
                    <div className="mapping-display p-4 bg-gray-50 rounded-lg">
                      <div className="grid grid-cols-auto gap-2 max-h-40 overflow-y-auto">
                        {binaryData?.split('').map((bit, index) => (
                          <div key={index} className="mapping-item flex items-center gap-2 text-sm">
                            <span className="bit-index text-gray-500 w-8">
                              {index}:
                            </span>
                            <span className={`bit-value w-6 text-center ${
                              bit === '1' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                            } rounded`}>
                              {bit}
                            </span>
                            <span className="arrow text-gray-400">→</span>
                            <span className={`transition w-16 text-center ${
                              bit === '1' ? 'text-green-600' : 'text-red-600'
                            } font-mono text-xs`}>
                              {bit === '1' ? 'H→L (↘)' : 'L→H (↗)'}
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
      {/* Differential Manchester Encoding Tab */}
{activeTab === 'diff' && (
  <div className="diff-manchester-section">
    <div className="controls-section mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* <div className="control-group">
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
        </div> */}
      </div>
    </div>

    <div className="data-display mb-4 p-3 bg-gray-50 rounded-lg">
      <div className="text-sm text-gray-600 mb-1">Input Binary Data:</div>
      <div className="font-mono text-lg text-purple-600 break-all">
        {binaryData || 'No input available'}
      </div>
      <div className="text-xs text-gray-500 mt-1">
        Length: {binaryData?.length || 0} bits
      </div>
    </div>

    {binaryData && binaryData.length > 0 && (() => {
      const bits = binaryToArray(binaryData);
      const half = samplesPerBit / 2;
      let signal = [];
      let lastLevel = 1; // start high

      bits.forEach(bit => {
        if (bit === 0) lastLevel = -lastLevel; // transition at start if 0
        for (let i = 0; i < half; i++) signal.push(lastLevel);
        lastLevel = -lastLevel; // always transition mid-bit
        for (let i = 0; i < half; i++) signal.push(lastLevel);
      });

      return (
        <>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Differential Manchester Encoded Signal
          </h3>

          <div className="waveform-container mb-6">
            <WaveformChart
              waveformData={{ signal, binaryInput: binaryData }}
              title="Differential Manchester Encoding"
              height={350}
              colors={['#2563EB']}
              yAxisLabel="Voltage (V)"
              xAxisLabel="Time (bit periods)"
            />
          </div>

          <div className="analysis-grid grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
  <div className="stat-card p-4 bg-white rounded-lg border text-center">
    <div className="text-sm text-gray-600">Total Bits</div>
    <div className="text-2xl font-bold text-purple-600">
      {binaryData?.length || 0}
    </div>
  </div>

  <div className="stat-card p-4 bg-white rounded-lg border text-center">
    <div className="text-sm text-gray-600">Transitions</div>
    <div className="text-2xl font-bold text-blue-600">
      {binaryData?.length || 0}
    </div>
  </div>

  <div className="stat-card p-4 bg-white rounded-lg border text-center">
    <div className="text-sm text-gray-600">Bandwidth</div>
    <div className="text-2xl font-bold text-orange-600">
      2x
    </div>
    <div className="text-xs text-gray-500">vs NRZ</div>
  </div>
</div>


          <div className="bit-mapping mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Bit-to-Transition Mapping:</h4>
            <div className="mapping-display p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-auto gap-2 max-h-40 overflow-y-auto">
                {binaryData.split('').map((bit, index) => (
                  <div key={index} className="mapping-item flex items-center gap-2 text-sm">
                    <span className="bit-index text-gray-500 w-8">{index}:</span>
                    <span
                      className={`bit-value w-6 text-center ${
                        bit === '1' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                      } rounded`}
                    >
                      {bit}
                    </span>
                    <span className="arrow text-gray-400">→</span>
                    <span
                      className={`transition w-16 text-center ${
                        bit === '1' ? 'text-green-600' : 'text-red-600'
                      } font-mono text-xs`}
                    >
                      {bit === '1' ? 'No Start Transition' : 'Start Transition'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      );
    })()}
  </div>
)}

      {/* Custom Input Tab */}
      {activeTab === 'custom' && (
        <div className="custom-section">
        
          
          {customSignalData && (
            <div className="custom-results mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Custom Manchester Encoded Signal
              </h3>
              
              <div className="waveform-container mb-6">
                <WaveformChart
                  waveformData={customSignalData}
                  title="Custom Manchester Encoding"
                  height={350}
                  colors={['#7C3AED']}
                  yAxisLabel="Voltage (V)"
                  xAxisLabel="Time (bit periods)"
                />
              </div>


              <div className="bit-mapping mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Custom Input Mapping:</h4>
                <div className="mapping-display p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-auto gap-2 max-h-40 overflow-y-auto">
                    {customSignalData?.binaryInput?.split('').map((bit, index) => (
                      <div key={index} className="mapping-item flex items-center gap-2 text-sm">
                        <span className="bit-index text-gray-500 w-8">
                          {index}:
                        </span>
                        <span className={`bit-value w-6 text-center ${
                          bit === '1' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        } rounded`}>
                          {bit}
                        </span>
                        <span className="arrow text-gray-400">→</span>
                        <span className={`transition w-16 text-center ${
                          bit === '1' ? 'text-green-600' : 'text-red-600'
                        } font-mono text-xs`}>
                          {bit === '1' ? 'H→L (↘)' : 'L→H (↗)'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
              title="Custom Binary Input for Manchester"
            />
          </div>

          <div className="controls-section mb-6">
            <div className="flex flex-wrap items-center gap-4">
              {/* <div className="control-group">
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
              </div> */}
              
              <button
                onClick={handleCustomEncode}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Encode Custom Input
              </button>
            </div>
          </div>

          {customSignalData && (
            <div className="custom-results">
              {/* <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Custom Manchester Encoded Signal
              </h3>
              
              <div className="waveform-container mb-6">
                <WaveformChart
                  waveformData={customSignalData}
                  title="Custom Manchester Encoding (IEEE 802.3)"
                  height={350}
                  colors={['#9333EA']}
                  yAxisLabel="Voltage (V)"
                  xAxisLabel="Time (bit periods)"
                />
              </div> */}

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

              <div className="bit-mapping mb-6">
                <h4 className="font-medium text-gray-700 mb-3">Custom Input Mapping:</h4>
                <div className="mapping-display p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-auto gap-2 max-h-40 overflow-y-auto">
                    {userInput.replace(/\s+/g, '').split('').map((bit, index) => (
                      <div key={index} className="mapping-item flex items-center gap-2 text-sm">
                        <span className="bit-index text-gray-500 w-8">
                          {index}:
                        </span>
                        <span className={`bit-value w-6 text-center ${
                          bit === '1' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                        } rounded`}>
                          {bit}
                        </span>
                        <span className="arrow text-gray-400">→</span>
                        <span className={`transition w-16 text-center ${
                          bit === '1' ? 'text-green-600' : 'text-red-600'
                        } font-mono text-xs`}>
                          {bit === '1' ? 'H→L (↘)' : 'L→H (↗)'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      <div className="comparison-section mb-6">
        <h4 className="font-medium text-gray-700 mb-3">Signal Characteristics Analysis:</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="char-card p-4 bg-green-50 rounded-lg border border-green-200">
            <h5 className="font-medium text-green-800 mb-2">✅ Self-Synchronizing</h5>
            <p className="text-sm text-green-700">
              Clock information is embedded in the signal through mandatory transitions in each bit period.
            </p>
          </div>
          
          <div className="char-card p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h5 className="font-medium text-blue-800 mb-2">⚡ No DC Component</h5>
            <p className="text-sm text-blue-700">
              Equal positive and negative areas ensure AC coupling compatibility.
            </p>
          </div>
          
          <div className="char-card p-4 bg-orange-50 rounded-lg border border-orange-200">
            <h5 className="font-medium text-orange-800 mb-2">📊 Higher Bandwidth</h5>
            <p className="text-sm text-orange-700">
              Requires twice the bandwidth of NRZ due to frequent transitions.
            </p>
          </div>
        </div>
      </div>

      <div className="info-section mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <h4 className="font-medium text-purple-800 mb-2">🔄 Manchester Encoding Characteristics:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
          <div>
            <h5 className="font-medium mb-1">Advantages:</h5>
            <ul className="space-y-1">
              <li>• Self-synchronizing (embedded clock)</li>
              <li>• No DC component</li>
              <li>• Error detection capability</li>
              <li>• AC coupling compatible</li>
              <li>• Robust against noise</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-1">Disadvantages:</h5>
            <ul className="space-y-1">
              <li>• Requires 2x bandwidth of NRZ</li>
              <li>• More complex implementation</li>
              <li>• Higher power consumption</li>
              <li>• Susceptible to phase shifts</li>
            </ul>
          </div>
        </div>
        <div className="mt-3 p-3 bg-white rounded border">
          <h5 className="font-medium text-purple-800 mb-1">Common Applications:</h5>
          <p className="text-sm text-purple-700">
            Ethernet (10BASE-T), Token Ring, some wireless protocols, and magnetic storage systems.
          </p>
        </div>
      </div>

      <div className="technical-details mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium text-gray-800 mb-2">Technical Implementation Details:</h4>
        <div className="text-sm text-gray-700">
          <ul className="space-y-1">
            <li>• Binary '1' starts high and transitions to low (falling edge)</li>
            <li>• Binary '0' starts low and transitions to high (rising edge)</li>
            <li>• Self-synchronizing - clock is embedded in the signal</li>
            <li>• No DC component due to equal high/low time per bit</li>
            <li>• Guaranteed transition per bit aids in clock recovery</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ManchesterEncodingStep;