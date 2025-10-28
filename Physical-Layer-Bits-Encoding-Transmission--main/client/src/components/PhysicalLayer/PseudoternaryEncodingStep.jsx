import React, { useState, useEffect } from 'react';
import WaveformChart from '../WaveformChart';
import { binaryToArray, pseudoternaryEncoding } from '../../utils/physicalLayerUtils';

const PseudoternaryEncodingStep = ({ 
  binaryData, 
  pseudoternarySignal, 
  onPseudoternaryEncode, 
  parameters, 
  onUpdateParameters 
}) => {
  const [samplesPerBit, setSamplesPerBit] = useState(20);
  const [signalData, setSignalData] = useState(null);

  useEffect(() => {
    if (binaryData && typeof binaryData === 'string' && binaryData.length > 0) {
      const bits = binaryToArray(binaryData);
      const encoded = pseudoternaryEncoding(bits, samplesPerBit);
      setSignalData(encoded);
      if (onPseudoternaryEncode) {
        onPseudoternaryEncode(binaryData, samplesPerBit);
      }
    }
  }, [binaryData, samplesPerBit, onPseudoternaryEncode]);

  // Prefer context-provided signal if available
  useEffect(() => {
    if (pseudoternarySignal && pseudoternarySignal.signal && pseudoternarySignal.signal.length > 0) {
      setSignalData(pseudoternarySignal);
    }
  }, [pseudoternarySignal]);

  const handleParameterChange = (param, value) => {
    if (param === 'samplesPerBit') {
      setSamplesPerBit(parseInt(value));
    }
    if (onUpdateParameters) {
      onUpdateParameters({ [param]: value });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Step 6: Pseudoternary Encoding
        </h2>
        <p className="text-gray-600 mb-4">
          Pseudoternary encoding represents binary 1 as zero voltage and binary 0 
          as alternating positive and negative voltages (opposite of AMI).
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Pseudoternary Characteristics</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Binary 1 → Zero voltage (0V)</li>
            <li>• Binary 0 → Alternating +1V/-1V</li>
            <li>• No DC component</li>
            <li>• Built-in error detection</li>
            <li>• Opposite polarity of AMI</li>
            <li>• Better for data with more 0s</li>
          </ul>
        </div>
      </div>

      {/* Binary Input */}
      <div className="mb-6">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Binary Input</h3>
          <div className="font-mono text-sm break-all bg-white p-2 rounded border">
            {binaryData || 'No binary data available'}
          </div>
        </div>
      </div>

      {/* Pseudoternary Waveform */}
      {signalData && (
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              Pseudoternary Encoded Waveform
            </h3>
            <WaveformChart
              waveformData={signalData}
              title="Pseudoternary Encoding Visualization"
              height={350}
              colors={["#9333EA"]}
              yAxisLabel="Amplitude (V)"
              xAxisLabel="Time (bit periods)"
            />
          </div>
        </div>
      )}

      {/* Comparison with AMI */}
      <div className="mb-6">
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-2">🔄 Comparison: AMI vs Pseudoternary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-green-700">
            <div>
              <h4 className="font-medium mb-1">AMI:</h4>
              <ul className="space-y-1 ml-4">
                <li>• '0' = 0V, '1' = alternating ±V</li>
                <li>• Better for data with more 1s</li>
                <li>• Used in T1/E1 systems</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-1">Pseudoternary:</h4>
              <ul className="space-y-1 ml-4">
                <li>• '1' = 0V, '0' = alternating ±V</li>
                <li>• Better for data with more 0s</li>
                <li>• Used in some Ethernet standards</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-2">💡 How it works:</h3>
        <div className="text-sm text-yellow-700">
          <p className="mb-2">
            <strong>Pseudoternary Encoding:</strong>
          </p>
          <ul className="space-y-1 ml-4">
            <li>• Binary '1' is represented by zero voltage</li>
            <li>• Binary '0' alternates between positive and negative voltage</li>
            <li>• First '0' might be +1V, second '0' is -1V, third is +1V, etc.</li>
            <li>• Provides same benefits as AMI but with reversed polarity</li>
            <li>• Choice between AMI and Pseudoternary depends on data characteristics</li>
            <li>• Both eliminate DC component and provide error detection</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PseudoternaryEncodingStep;