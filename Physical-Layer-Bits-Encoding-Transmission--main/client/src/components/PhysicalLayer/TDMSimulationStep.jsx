import React, { useState, useEffect } from 'react';

const TDMSimulationStep = ({ binaryData, tdmSignal, onPerformTDM }) => {
  const [numStreams, setNumStreams] = useState(4);
  const [streamData, setStreamData] = useState([
    '10101010',
    '11001100', 
    '11110000',
    '01010101'
  ]);

  useEffect(() => {
    if (binaryData && !tdmSignal?.multiplexedData) {
      handlePerformTDM();
    }
  }, [binaryData, tdmSignal]);

  const handlePerformTDM = () => {
    const dataStreams = streamData.slice(0, numStreams).map(stream => 
      stream.split('').map(bit => parseInt(bit))
    );
    onPerformTDM(dataStreams);
  };

  const handleStreamChange = (index, value) => {
    const newStreamData = [...streamData];
    newStreamData[index] = value;
    setStreamData(newStreamData);
  };

  const addSampleData = () => {
    const samples = ['10101010', '11001100', '11110000', '01010101', '10011001', '11000011'];
    setStreamData(samples.slice(0, numStreams));
  };

  return (
    <div className="step-container p-6 bg-white rounded-lg shadow-lg">
      <div className="step-header mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Step 9: Time Division Multiplexing (TDM)
        </h2>
        <p className="text-gray-600">
          Simulate TDM by interleaving multiple data streams into a single time-shared channel.
        </p>
      </div>

      <div className="controls-section mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="stream-controls p-4 bg-cyan-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-4">TDM Configuration</h4>
            
            <div className="control-group mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Streams: {numStreams}
              </label>
              <input
                type="range"
                min="2"
                max="6"
                value={numStreams}
                onChange={(e) => setNumStreams(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="streams-input space-y-3">
              {Array.from({ length: numStreams }, (_, i) => (
                <div key={i} className="stream-input">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stream {i + 1}:
                  </label>
                  <input
                    type="text"
                    value={streamData[i] || ''}
                    onChange={(e) => handleStreamChange(i, e.target.value)}
                    placeholder="Enter binary data..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 font-mono text-sm"
                  />
                </div>
              ))}
            </div>

            <div className="action-buttons mt-4 space-y-2">
              <button
                onClick={addSampleData}
                className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors text-sm"
              >
                Load Sample Data
              </button>
              
              <button
                onClick={handlePerformTDM}
                className="w-full px-4 py-3 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 transition-colors font-medium"
              >
                Perform TDM Multiplexing
              </button>
            </div>
          </div>

          <div className="tdm-info p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-700 mb-4">TDM Process</h4>
            
            <div className="process-steps space-y-3">
              <div className="step-item flex items-center gap-3">
                <div className="step-number w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
                <span className="text-sm text-gray-700">Collect data from {numStreams} streams</span>
              </div>
              
              <div className="step-item flex items-center gap-3">
                <div className="step-number w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
                <span className="text-sm text-gray-700">Assign time slots to each stream</span>
              </div>
              
              <div className="step-item flex items-center gap-3">
                <div className="step-number w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
                <span className="text-sm text-gray-700">Interleave bits in round-robin fashion</span>
              </div>
              
              <div className="step-item flex items-center gap-3">
                <div className="step-number w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</div>
                <span className="text-sm text-gray-700">Generate multiplexed output stream</span>
              </div>
            </div>

            {tdmSignal && (
              <div className="tdm-stats mt-4 p-3 bg-white rounded border">
                <div className="text-sm text-gray-600">Multiplexed Data Length:</div>
                <div className="text-lg font-bold text-cyan-600">
                  {tdmSignal.multiplexedData?.length || 0} bits
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {tdmSignal?.multiplexedData && (
        <div className="results-section">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            TDM Multiplexing Results
          </h3>
          
          <div className="multiplexed-output mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Multiplexed Data Stream:</h4>
            <div className="output-display p-4 bg-gray-50 rounded-lg">
              <div className="multiplexed-bits font-mono text-sm">
                {tdmSignal.multiplexedData.map((bit, index) => (
                  <span
                    key={index}
                    className={`inline-block w-8 h-8 text-center leading-8 ${
                      bit === 1 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                    } mr-1 mb-1 rounded text-xs`}
                    title={`Bit ${index}: ${bit} (${tdmSignal.streamLabels[index]})`}
                  >
                    {bit}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="tdm-analysis mb-6">
            <h4 className="font-medium text-gray-700 mb-3">TDM Frame Analysis:</h4>
            <div className="analysis-grid grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="analysis-card p-4 bg-white rounded-lg border">
                <div className="text-sm text-gray-600">Total Frames</div>
                <div className="text-2xl font-bold text-cyan-600">
                  {tdmSignal.totalFrames}
                </div>
              </div>
              
              <div className="analysis-card p-4 bg-white rounded-lg border">
                <div className="text-sm text-gray-600">Frame Length</div>
                <div className="text-2xl font-bold text-blue-600">
                  {tdmSignal.frameLength} slots
                </div>
              </div>
              
              <div className="analysis-card p-4 bg-white rounded-lg border">
                <div className="text-sm text-gray-600">Time Slots</div>
                <div className="text-2xl font-bold text-green-600">
                  {tdmSignal.timeSlots}
                </div>
              </div>
              
              <div className="analysis-card p-4 bg-white rounded-lg border">
                <div className="text-sm text-gray-600">Efficiency</div>
                <div className="text-2xl font-bold text-purple-600">
                  {((tdmSignal.multiplexedData.filter(bit => bit !== 0).length / tdmSignal.multiplexedData.length) * 100).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          <div className="frame-visualization mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Frame Structure Visualization:</h4>
            <div className="frame-display p-4 bg-gray-50 rounded-lg overflow-x-auto">
              <div className="frame-table">
                <div className="table-header grid grid-flow-col auto-cols-max gap-1 mb-2">
                  <div className="header-cell w-16 text-center text-xs font-medium text-gray-600 p-2">Frame #</div>
                  {Array.from({ length: numStreams }, (_, i) => (
                    <div key={i} className="header-cell w-16 text-center text-xs font-medium text-gray-600 p-2">
                      Slot {i + 1}
                    </div>
                  ))}
                </div>
                
                {Array.from({ length: Math.min(tdmSignal.totalFrames, 8) }, (_, frameIndex) => (
                  <div key={frameIndex} className="grid grid-flow-col auto-cols-max gap-1 mb-1">
                    <div className="cell w-16 text-center text-xs text-gray-600 p-2 bg-white rounded">
                      {frameIndex + 1}
                    </div>
                    {Array.from({ length: numStreams }, (_, slotIndex) => {
                      const bitIndex = frameIndex * numStreams + slotIndex;
                      const bit = tdmSignal.multiplexedData[bitIndex];
                      const streamLabel = tdmSignal.streamLabels[bitIndex];
                      
                      return (
                        <div
                          key={slotIndex}
                          className={`cell w-16 text-center text-xs p-2 rounded ${
                            bit === 1 ? 'bg-green-600 text-white' : 
                            bit === 0 ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-600'
                          }`}
                          title={`${streamLabel}: ${bit}`}
                        >
                          {bit !== undefined ? bit : '-'}
                        </div>
                      );
                    })}
                  </div>
                ))}
                
                {tdmSignal.totalFrames > 8 && (
                  <div className="text-center text-sm text-gray-500 mt-2">
                    ... and {tdmSignal.totalFrames - 8} more frames
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="info-section mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
        <h4 className="font-medium text-cyan-800 mb-2">🔄 Time Division Multiplexing:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-cyan-700">
          <div>
            <h5 className="font-medium mb-1">Key Features:</h5>
            <ul className="space-y-1">
              <li>• Multiple data streams share single channel</li>
              <li>• Each stream gets dedicated time slots</li>
              <li>• Round-robin scheduling</li>
              <li>• Synchronous operation required</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-1">Applications:</h5>
            <ul className="space-y-1">
              <li>• Digital telephone systems (T1/E1)</li>
              <li>• ISDN networks</li>
              <li>• Digital radio systems</li>
              <li>• Satellite communications</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TDMSimulationStep;