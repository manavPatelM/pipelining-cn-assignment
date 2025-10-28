import React, { useState } from 'react';
import { generateSampleData } from '../../utils/physicalLayerUtils';

const FrameToBinaryStep = ({ onConvert, frameData, binaryData }) => {
  const [inputData, setInputData] = useState(frameData || '');
  const [inputType, setInputType] = useState('text');

  const handleConvert = () => {
    if (inputData.trim()) {
      onConvert(inputData, inputType);
    }
  };

  const handleSampleData = () => {
    const sample = generateSampleData(inputType);
    setInputData(sample);
  };

  const handleInputChange = (e) => {
    setInputData(e.target.value);
  };

  return (
    <div className="step-container p-6 bg-white rounded-lg shadow-lg">
      <div className="step-header mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Step 1: Frame Data to Binary Conversion
        </h2>
        <p className="text-gray-600">
          Convert your frame data (text, hex, or binary) into a binary bitstream for transmission.
        </p>
      </div>

      <div className="input-section mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex gap-4 items-center">
            <label className="block text-sm font-medium text-gray-700">
              Input Type:
            </label>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Text</option>
              <option value="hex">Hexadecimal</option>
              <option value="binary">Binary</option>
            </select>
            <button
              onClick={handleSampleData}
              className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
            >
              Use Sample Data
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frame Data:
            </label>
            <textarea
              value={inputData}
              onChange={handleInputChange}
              placeholder={`Enter your ${inputType} data here...`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px] font-mono"
            />
          </div>

          <button
            onClick={handleConvert}
            disabled={!inputData.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Convert to Binary
          </button>
        </div>
      </div>

      {binaryData && (
        <div className="results-section">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Conversion Results
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="result-card p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Original Data:</h4>
              <p className="font-mono text-sm bg-white p-2 rounded border break-all">
                {frameData}
              </p>
            </div>
            
            <div className="result-card p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Binary Output:</h4>
              <p className="font-mono text-sm bg-white p-2 rounded border break-all">
                {binaryData}
              </p>
            </div>
          </div>

          <div className="info-grid mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="info-card p-3 bg-white rounded border">
              <div className="text-sm text-gray-600">Original Length</div>
              <div className="text-lg font-semibold text-gray-800">
                {frameData?.length || 0} characters
              </div>
            </div>
            
            <div className="info-card p-3 bg-white rounded border">
              <div className="text-sm text-gray-600">Binary Length</div>
              <div className="text-lg font-semibold text-blue-600">
                {binaryData?.length || 0} bits
              </div>
            </div>
            
            <div className="info-card p-3 bg-white rounded border">
              <div className="text-sm text-gray-600">Compression Ratio</div>
              <div className="text-lg font-semibold text-green-600">
                {frameData && binaryData ? 
                  `1:${(binaryData.length / frameData.length).toFixed(1)}` : 
                  'N/A'
                }
              </div>
            </div>
          </div>

          <div className="binary-visualization mt-4">
            <h4 className="font-medium text-gray-700 mb-2">Binary Visualization:</h4>
            <div className="binary-display p-4 bg-gray-900 text-green-400 font-mono text-sm rounded-lg overflow-x-auto">
              {binaryData?.split('').map((bit, index) => (
                <span
                  key={index}
                  className={`inline-block w-6 text-center ${
                    bit === '1' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  } mr-1 mb-1 rounded`}
                >
                  {bit}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="help-section mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h4 className="font-medium text-yellow-800 mb-2">💡 How it works:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Text: Each character is converted to its ASCII value, then to 8-bit binary</li>
          <li>• Hexadecimal: Each hex digit is converted to 4-bit binary</li>
          <li>• Binary: Input is used as-is (must contain only 0s and 1s)</li>
          <li>• The resulting binary stream represents the frame ready for encoding</li>
        </ul>
      </div>
    </div>
  );
};

export default FrameToBinaryStep;