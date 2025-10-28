import React, { useEffect } from 'react';
import WaveformChart from '../WaveformChart';

const NRZEncodingStep = ({ binaryData, nrzSignal, onEncode }) => {
  useEffect(() => {
    if (binaryData && !nrzSignal?.signal) {
      onEncode(binaryData);
    }
  }, [binaryData, nrzSignal, onEncode]);

  const handleRegenerate = () => {
    if (binaryData) {
      onEncode(binaryData);
    }
  };

  return (
    <div className="step-container p-6 bg-white rounded-lg shadow-lg">
      <div className="step-header mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Step 2: Non-Return-to-Zero (NRZ) Encoding
        </h2>
        <p className="text-gray-600">
          Convert binary data to NRZ line coding where '1' is represented by +1V and '0' by -1V.
        </p>
      </div>

      {!binaryData && (
        <div className="alert p-4 bg-yellow-50 border border-yellow-200 rounded-lg mb-6">
          <p className="text-yellow-800">
            ⚠️ Please complete Step 1 (Frame to Binary Conversion) first.
          </p>
        </div>
      )}

      {binaryData && (
        <div className="input-section mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="input-card p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">Binary Input:</h4>
              <div className="binary-display p-3 bg-white rounded border font-mono text-sm break-all max-h-32 overflow-y-auto">
                {binaryData.split('').map((bit, index) => (
                  <span
                    key={index}
                    className={`inline-block w-6 text-center ${
                      bit === '1' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    } mr-1 mb-1 rounded text-xs`}
                  >
                    {bit}
                  </span>
                ))}
              </div>
            </div>

            <div className="control-card p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-gray-700 mb-2">NRZ Encoding Rules:</h4>
              <ul className="text-sm text-gray-700 space-y-1 mb-4">
                <li>• Binary '1' → +1V (High level)</li>
                <li>• Binary '0' → -1V (Low level)</li>
                <li>• No return to zero between bits</li>
                <li>• Simple but requires clock recovery</li>
              </ul>
              
              <button
                onClick={handleRegenerate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                Regenerate NRZ Signal
              </button>
            </div>
          </div>
        </div>
      )}

      {nrzSignal?.signal && (
        <div className="results-section">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            NRZ Waveform
          </h3>
          
          <div className="waveform-container mb-6">
            <WaveformChart
              waveformData={nrzSignal}
              title="NRZ (Non-Return-to-Zero) Encoding"
              height={350}
              colors={['#2563EB']}
              yAxisLabel="Voltage (V)"
              xAxisLabel="Time (bit periods)"
            />
          </div>

          <div className="analysis-grid grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="stat-card p-4 bg-white rounded-lg border">
              <div className="text-sm text-gray-600">Total Bits</div>
              <div className="text-2xl font-bold text-blue-600">
                {binaryData?.length || 0}
              </div>
            </div>
            
            <div className="stat-card p-4 bg-white rounded-lg border">
              <div className="text-sm text-gray-600">Signal Samples</div>
              <div className="text-2xl font-bold text-green-600">
                {nrzSignal?.signal?.length || 0}
              </div>
            </div>
            
            <div className="stat-card p-4 bg-white rounded-lg border">
              <div className="text-sm text-gray-600">High Levels</div>
              <div className="text-2xl font-bold text-emerald-600">
                {(binaryData?.match(/1/g) || []).length}
              </div>
            </div>
            
            <div className="stat-card p-4 bg-white rounded-lg border">
              <div className="text-sm text-gray-600">Low Levels</div>
              <div className="text-2xl font-bold text-red-600">
                {(binaryData?.match(/0/g) || []).length}
              </div>
            </div>
          </div>

          <div className="bit-mapping mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Bit-to-Signal Mapping:</h4>
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
                    <span className={`voltage w-12 text-center ${
                      bit === '1' ? 'text-green-600' : 'text-red-600'
                    } font-mono`}>
                      {bit === '1' ? '+1V' : '-1V'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="info-section mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">📊 NRZ Encoding Characteristics:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div>
            <h5 className="font-medium mb-1">Advantages:</h5>
            <ul className="space-y-1">
              <li>• Simple implementation</li>
              <li>• Efficient bandwidth usage</li>
              <li>• Easy to generate and detect</li>
              <li>• No amplitude variations</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-1">Disadvantages:</h5>
            <ul className="space-y-1">
              <li>• DC component present</li>
              <li>• No built-in clock recovery</li>
              <li>• Synchronization issues with long runs</li>
              <li>• Baseline wander in AC-coupled systems</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NRZEncodingStep;