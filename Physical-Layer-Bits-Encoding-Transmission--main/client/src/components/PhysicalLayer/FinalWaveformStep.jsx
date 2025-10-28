import React, { useEffect } from 'react';
import WaveformChart from '../WaveformChart';

const FinalWaveformStep = ({ finalWaveform, onGenerateFinal }) => {
  // Auto-generate final waveform when component mounts or when dependencies change
  useEffect(() => {
    console.log('FinalWaveformStep: useEffect triggered. Auto-generating final waveform.');
    onGenerateFinal();
  }, [onGenerateFinal]); // Re-run when onGenerateFinal function reference changes (which it shouldn't, but good practice)

  const handleGenerateFinal = () => {
    console.log('FinalWaveformStep: Manual final waveform generation triggered');
    onGenerateFinal();
  };

  const exportWaveformData = () => {
    if (!finalWaveform) return;
    
    const exportData = {
      timestamp: new Date().toISOString(),
      waveforms: finalWaveform,
      metadata: {
        generatedBy: 'Physical Layer Simulator',
        version: '1.0.0'
      }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'physical_layer_waveforms.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const getWaveformArray = () => {
    if (!finalWaveform) return [];
    
    console.log('FinalWaveformStep: Processing finalWaveform:', finalWaveform);
    
    const waveforms = [];
    
    // Add the final processed waveform (main result)
    if (finalWaveform.waveform?.length) {
      const timeAxis = finalWaveform.waveform.map((_, index) => index * 0.1);
      waveforms.push({
        signal: finalWaveform.waveform,
        timeAxis,
        encoding: `Final Waveform (${finalWaveform.signalSource || 'processed'})`
      });
    }
    
    // Add all available encodings for comparison
    if (finalWaveform.encodings) {
      const encodings = finalWaveform.encodings;
      
      if (encodings.original?.signal?.length) {
        waveforms.push({
          signal: encodings.original.signal,
          timeAxis: encodings.original.timeAxis || encodings.original.signal.map((_, i) => i * 0.1),
          encoding: 'NRZ-L Original'
        });
      }
      
      if (encodings.nrzi?.signal?.length) {
        waveforms.push({
          signal: encodings.nrzi.signal,
          timeAxis: encodings.nrzi.timeAxis || encodings.nrzi.signal.map((_, i) => i * 0.1),
          encoding: 'NRZ-I'
        });
      }
      
      if (encodings.manchester?.signal?.length) {
        waveforms.push({
          signal: encodings.manchester.signal,
          timeAxis: encodings.manchester.timeAxis || encodings.manchester.signal.map((_, i) => i * 0.1),
          encoding: 'Manchester'
        });
      }
      
      if (encodings.ami?.signal?.length) {
        waveforms.push({
          signal: encodings.ami.signal,
          timeAxis: encodings.ami.timeAxis || encodings.ami.signal.map((_, i) => i * 0.1),
          encoding: 'AMI'
        });
      }
      
      if (encodings.pseudoternary?.signal?.length) {
        waveforms.push({
          signal: encodings.pseudoternary.signal,
          timeAxis: encodings.pseudoternary.timeAxis || encodings.pseudoternary.signal.map((_, i) => i * 0.1),
          encoding: 'Pseudoternary'
        });
      }
    }
    
    // Add processing stages if available
    if (finalWaveform.processing) {
      const processing = finalWaveform.processing;
      
      if (processing.noisy?.length) {
        const timeAxis = processing.noisy.map((_, index) => index * 0.1);
        waveforms.push({
          signal: processing.noisy,
          timeAxis,
          encoding: 'With Noise Added'
        });
      }
      
      if (processing.attenuated?.attenuatedSignal?.length) {
        const timeAxis = processing.attenuated.attenuatedSignal.map((_, index) => index * 0.1);
        waveforms.push({
          signal: processing.attenuated.attenuatedSignal,
          timeAxis,
          encoding: 'Attenuated Signal'
        });
      }
    }
    
    console.log('FinalWaveformStep: Generated waveforms array:', waveforms.map(w => ({ encoding: w.encoding, signalLength: w.signal?.length })));
    return waveforms;
  };

  const waveformArray = getWaveformArray();

  return (
    <div className="step-container p-6 bg-white rounded-lg shadow-lg">
      <div className="step-header mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Step 13: Final Binary Waveforms
        </h2>
        <p className="text-gray-600">
          View and export the complete set of binary waveforms generated through the physical layer simulation pipeline.
        </p>
      </div>

      {/* Debug Info Section */}
      <div className="debug-info mb-4 p-3 bg-gray-100 rounded-lg">
        <details className="cursor-pointer">
          <summary className="text-sm font-medium text-gray-700">Debug Info (Click to expand)</summary>
          <div className="mt-2 text-xs text-gray-600">
            <p><strong>Final Waveform Available:</strong> {finalWaveform ? 'Yes' : 'No'}</p>
            {finalWaveform && (
              <>
                <p><strong>Signal Source:</strong> {finalWaveform.signalSource || 'unknown'}</p>
                <p><strong>Waveform Length:</strong> {finalWaveform.waveform?.length || 0}</p>
                <p><strong>Bits Length:</strong> {finalWaveform.bits?.length || 0}</p>
                <p><strong>Timestamp:</strong> {finalWaveform.timestamp ? new Date(finalWaveform.timestamp).toLocaleTimeString() : 'N/A'}</p>
              </>
            )}
            <p><strong>Waveforms Generated:</strong> {waveformArray.length}</p>
            {waveformArray.length > 0 && (
              <ul className="ml-4">
                {waveformArray.map((w, i) => (
                  <li key={i}>• {w.encoding} ({w.signal?.length || 0} samples)</li>
                ))}
              </ul>
            )}
          </div>
        </details>
      </div>

      {!finalWaveform && (
        <div className="generate-section mb-6">
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-blue-300">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Generate Final Waveforms
              </h3>
              <p className="text-gray-600 mb-4">
                Compile all the processed signals from the simulation pipeline into a comprehensive waveform display.
              </p>
              <button
                onClick={handleGenerateFinal}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium"
              >
                Generate Final Waveforms
              </button>
            </div>
          </div>
        </div>
      )}

      {finalWaveform && waveformArray.length === 0 && (
        <div className="no-waveforms-section mb-6">
          <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-200">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                ⚠️ No Waveforms Available
              </h3>
              <p className="text-yellow-700 mb-4">
                Final waveform data exists but no displayable waveforms could be generated. 
                This may indicate missing signal data from previous steps.
              </p>
              <button
                onClick={handleGenerateFinal}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-all font-medium"
              >
                Retry Generation
              </button>
            </div>
          </div>
        </div>
      )}

      {finalWaveform && waveformArray.length > 0 && (
        <div className="results-section">
          <div className="results-header mb-6 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              Complete Waveform Collection
            </h3>
            <button
              onClick={exportWaveformData}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Export Waveforms
            </button>
          </div>

          <div className="waveform-display mb-6">
            <WaveformChart
              waveformData={waveformArray}
              title="Physical Layer Signal Processing Pipeline"
              height={500}
              colors={['#3B82F6', '#9333EA', '#059669', '#DC2626', '#F59E0B']}
              yAxisLabel="Amplitude (V)"
              xAxisLabel="Time (bit periods)"
              showPoints={false}
            />
          </div>

          <div className="waveform-summary mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Waveform Summary:</h4>
            <div className="summary-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {waveformArray.map((waveform, index) => (
                <div key={index} className="summary-card p-4 bg-gray-50 rounded-lg border">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: ['#3B82F6', '#9333EA', '#059669', '#DC2626', '#F59E0B'][index] }}
                    ></div>
                    <h5 className="font-medium text-gray-700">{waveform.encoding}</h5>
                  </div>
                  <div className="stats space-y-1 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Samples:</span>
                      <span className="font-mono">{waveform.signal?.length || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-mono">
                        {waveform.timeAxis ? `${waveform.timeAxis[waveform.timeAxis.length - 1]?.toFixed(1)} bit periods` : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Peak Amplitude:</span>
                      <span className="font-mono">
                        {waveform.signal ? `±${Math.max(...waveform.signal.map(Math.abs)).toFixed(2)}V` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pipeline-overview mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Processing Pipeline Overview:</h4>
            <div className="pipeline-flow p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
              <div className="flow-steps flex flex-wrap items-center justify-center gap-4">
                <div className="step-box p-3 bg-white rounded shadow text-center">
                  <div className="text-sm font-medium text-gray-700">Frame Data</div>
                  <div className="text-xs text-gray-500">Text → Binary</div>
                </div>
                
                <div className="arrow text-gray-400">→</div>
                
                <div className="step-box p-3 bg-white rounded shadow text-center">
                  <div className="text-sm font-medium text-blue-700">Encoding</div>
                  <div className="text-xs text-gray-500">NRZ/Manchester/NRZI</div>
                </div>
                
                <div className="arrow text-gray-400">→</div>
                
                <div className="step-box p-3 bg-white rounded shadow text-center">
                  <div className="text-sm font-medium text-red-700">Noise</div>
                  <div className="text-xs text-gray-500">Channel Effects</div>
                </div>
                
                <div className="arrow text-gray-400">→</div>
                
                <div className="step-box p-3 bg-white rounded shadow text-center">
                  <div className="text-sm font-medium text-orange-700">Attenuation</div>
                  <div className="text-xs text-gray-500">Distance Loss</div>
                </div>
                
                <div className="arrow text-gray-400">→</div>
                
                <div className="step-box p-3 bg-white rounded shadow text-center">
                  <div className="text-sm font-medium text-purple-700">TDM</div>
                  <div className="text-xs text-gray-500">Multiplexing</div>
                </div>
              </div>
            </div>
          </div>

          {finalWaveform.tdm && (
            <div className="tdm-summary mb-6">
              <h4 className="font-medium text-gray-700 mb-3">TDM Summary:</h4>
              <div className="tdm-info p-4 bg-cyan-50 rounded-lg border border-cyan-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="info-item text-center">
                    <div className="text-sm text-gray-600">Multiplexed Streams</div>
                    <div className="text-lg font-bold text-cyan-600">
                      {finalWaveform.tdm.timeSlots || 0}
                    </div>
                  </div>
                  
                  <div className="info-item text-center">
                    <div className="text-sm text-gray-600">Total Bits</div>
                    <div className="text-lg font-bold text-blue-600">
                      {finalWaveform.tdm.multiplexedData?.length || 0}
                    </div>
                  </div>
                  
                  <div className="info-item text-center">
                    <div className="text-sm text-gray-600">Frames</div>
                    <div className="text-lg font-bold text-green-600">
                      {finalWaveform.tdm.totalFrames || 0}
                    </div>
                  </div>
                  
                  <div className="info-item text-center">
                    <div className="text-sm text-gray-600">Frame Length</div>
                    <div className="text-lg font-bold text-purple-600">
                      {finalWaveform.tdm.frameLength || 0} slots
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="export-options">
            <h4 className="font-medium text-gray-700 mb-3">Export Options:</h4>
            <div className="options-grid grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={exportWaveformData}
                className="export-btn p-4 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors text-left"
              >
                <div className="font-medium text-green-700">📄 JSON Export</div>
                <div className="text-sm text-green-600">Complete waveform data</div>
              </button>
              
              <button
                onClick={() => window.print()}
                className="export-btn p-4 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors text-left"
              >
                <div className="font-medium text-blue-700">🖨️ Print Report</div>
                <div className="text-sm text-blue-600">Generate printable report</div>
              </button>
              
              <button
                onClick={() => {
                  const canvas = document.querySelector('canvas');
                  if (canvas) {
                    const link = document.createElement('a');
                    link.download = 'waveforms.png';
                    link.href = canvas.toDataURL();
                    link.click();
                  }
                }}
                className="export-btn p-4 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors text-left"
              >
                <div className="font-medium text-purple-700">🖼️ Save Image</div>
                <div className="text-sm text-purple-600">Export waveform chart</div>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="info-section mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="font-medium text-gray-800 mb-2">🎯 Simulation Complete:</h4>
        <div className="text-sm text-gray-700">
          <p className="mb-2">
            This completes the physical layer simulation pipeline. The final waveforms represent 
            the complete signal processing chain from frame data input to transmission-ready signals.
          </p>
          <p>
            Use the export options to save your results for analysis or documentation purposes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinalWaveformStep;