import React, { useState, useEffect } from 'react';
import WaveformChart from '../WaveformChart';
import BinaryInputSection from './BinaryInputSection';
import { binaryToArray, nrzLEncoding, validateBinaryInput } from '../../utils/physicalLayerUtils';

const NRZLEncodingStep = ({ 
  binaryData, 
  nrzLSignal, 
  onNRZLEncode, 
  parameters, 
  onUpdateParameters 
}) => {
  const [samplesPerBit, setSamplesPerBit] = useState(20);
  const [signalData, setSignalData] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [inputError, setInputError] = useState('');
  const [customSignalData, setCustomSignalData] = useState(null);
  const [activeTab, setActiveTab] = useState('pipeline'); // 'pipeline' or 'custom'

  useEffect(() => {
    if (binaryData && typeof binaryData === 'string' && binaryData.length > 0) {
      console.log('NRZ-L: Processing binary data:', binaryData);
      const bits = binaryToArray(binaryData);
      console.log('NRZ-L: Converted to bits:', bits);
      const encoded = nrzLEncoding(bits, samplesPerBit);
      console.log('NRZ-L: Encoded signal:', encoded);
      setSignalData(encoded);
      if (onNRZLEncode) {
        onNRZLEncode(binaryData, samplesPerBit);
      }
    } else {
      console.log('NRZ-L: No valid binary data available:', binaryData);
    }
  }, [binaryData, samplesPerBit, onNRZLEncode]);

  // Also use nrzLSignal from props if available
  useEffect(() => {
    if (nrzLSignal && nrzLSignal.signal && nrzLSignal.signal.length > 0) {
      console.log('NRZ-L: Using signal from props:', nrzLSignal);
      setSignalData(nrzLSignal);
    }
  }, [nrzLSignal]);

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
    const encoded = nrzLEncoding(bits, samplesPerBit);
    setCustomSignalData(encoded);
  };

  const handleCustomEncode = () => {
    const validation = validateBinaryInput(userInput);
    if (validation.isValid) {
      setInputError('');
      const bits = binaryToArray(validation.cleanedInput);
      const encoded = nrzLEncoding(bits, samplesPerBit);
      setCustomSignalData(encoded);
    } else {
      setInputError(validation.error);
    }
  };

  const handleManualEncode = () => {
    if (binaryData && typeof binaryData === 'string' && binaryData.length > 0) {
      console.log('Manual encode triggered with binary data:', binaryData);
      const bits = binaryToArray(binaryData);
      const encoded = nrzLEncoding(bits, samplesPerBit);
      setSignalData(encoded);
      if (onNRZLEncode) {
        onNRZLEncode(binaryData, samplesPerBit);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Step 2: NRZ-L Encoding
        </h2>
        <p className="text-gray-600 mb-4">
          Non-Return-to-Zero Level (NRZ-L) encoding represents binary 1 as positive voltage 
          and binary 0 as negative voltage.
        </p>
        
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'pipeline'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pipeline Data
          </button>
          <button
            onClick={() => setActiveTab('custom')}
            className={`px-4 py-2 border-b-2 font-medium text-sm ${
              activeTab === 'custom'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Custom Input
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">NRZ-L Characteristics</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Binary 1 → Positive voltage (+1V)</li>
            <li>• Binary 0 → Negative voltage (-1V)</li>
            <li>• Simple implementation</li>
            <li>• DC component present</li>
            <li>• No self-synchronization</li>
            <li>• Bandwidth efficient</li>
          </ul>
          
          {activeTab === 'pipeline' && (
            <button
              onClick={handleManualEncode}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Generate NRZ-L Encoding
            </button>
          )}
          
          {activeTab === 'custom' && (
            <div className="mt-3">
              <button
                onClick={handleCustomEncode}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
              >
                Encode Custom Input
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'custom' && (
        <div className="mb-6">
          <BinaryInputSection
            userInput={userInput}
            setUserInput={setUserInput}
            inputError={inputError}
            setInputError={setInputError}
            onValidInput={handleUserInputChange}
            title="Custom Binary Input for NRZ-L"
          />
        </div>
      )}

      {/* Pipeline Data Input Display */}
      {activeTab === 'pipeline' && (
        <div className="mb-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">Pipeline Binary Input</h3>
            <div className="font-mono text-sm break-all bg-white p-2 rounded border">
              {binaryData || 'No binary data available from pipeline'}
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Data type: {typeof binaryData}, Length: {binaryData ? binaryData.length : 0}
            </div>
          </div>
        </div>
      )}

      {/* NRZ-L Waveform */}
      <div className="mb-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            NRZ-L Encoded Waveform
            {activeTab === 'custom' && customSignalData && (
              <span className="text-sm font-normal text-green-600 ml-2">(Custom Input)</span>
            )}
            {activeTab === 'pipeline' && signalData && (
              <span className="text-sm font-normal text-blue-600 ml-2">(Pipeline Data)</span>
            )}
          </h3>
          
          {activeTab === 'pipeline' && !signalData ? (
            <div className="p-8 text-center">
              <div className="text-gray-500 mb-2">No waveform data available</div>
              <div className="text-xs text-gray-400">
                Signal data: {signalData ? 'Available' : 'Not available'}
                <br />
                Binary data: {binaryData ? `"${binaryData}"` : 'Not available'}
              </div>
            </div>
          ) : activeTab === 'custom' && !customSignalData ? (
            <div className="p-8 text-center">
              <div className="text-gray-500 mb-2">Enter binary data to see waveform</div>
              <div className="text-xs text-gray-400">
                Enter a valid binary string in the Custom Input tab
              </div>
            </div>
          ) : (
            <WaveformChart
              waveformData={activeTab === 'custom' ? customSignalData : signalData}
              title="NRZ-L Encoding Visualization"
              height={350}
              colors={["#3B82F6"]}
              yAxisLabel="Amplitude (V)"
              xAxisLabel="Time (bit periods)"
            />
          )}
          
          {/* Display binary sequence under waveform */}
          {((activeTab === 'pipeline' && signalData) || (activeTab === 'custom' && customSignalData)) && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Binary Sequence:</h4>
              <div className="font-mono text-lg">
                {(activeTab === 'custom' ? userInput.replace(/\s+/g, '') : binaryData)?.split('').map((bit, index) => (
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
          )}
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-2">💡 How it works:</h3>
        <div className="text-sm text-yellow-700">
          <p className="mb-2">
            <strong>NRZ-L (Non-Return-to-Zero Level):</strong>
          </p>
          <ul className="space-y-1 ml-4">
            <li>• The signal level directly represents the bit value</li>
            <li>• High voltage (+1V) represents binary '1'</li>
            <li>• Low voltage (-1V) represents binary '0'</li>
            <li>• Simple to implement but has DC component</li>
            <li>• Suitable for short-distance transmission</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NRZLEncodingStep;