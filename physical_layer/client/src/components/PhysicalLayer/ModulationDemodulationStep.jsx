import React, { useState, useEffect } from 'react';
import WaveformChart from '../WaveformChart';
import { binaryToArray, askModulation, fskModulation, pskModulation, simpleDemodulation } from '../../utils/physicalLayerUtils';

const ModulationDemodulationStep = ({ 
  binaryData, 
  modulatedSignal,
  demodulatedSignal,
  onModulate,
  onDemodulate,
  parameters, 
  onUpdateParameters 
}) => {
  const [modulationType, setModulationType] = useState('ASK');
  const [carrierFreq, setCarrierFreq] = useState(10);
  const [freq0, setFreq0] = useState(5);
  const [freq1, setFreq1] = useState(10);
  const [samplesPerBit, setSamplesPerBit] = useState(100);
  const [modulatedData, setModulatedData] = useState(null);
  const [demodulatedBits, setDemodulatedBits] = useState(null);

  useEffect(() => {
    if (binaryData) {
      performModulation();
    }
  }, [binaryData, modulationType, carrierFreq, freq0, freq1, samplesPerBit]);

  const performModulation = () => {
    if (!binaryData || typeof binaryData !== 'string' || binaryData.length === 0) return;

    const bits = binaryToArray(binaryData);
    let modulated;

    switch (modulationType) {
      case 'ASK':
        modulated = askModulation(bits, carrierFreq, samplesPerBit);
        break;
      case 'FSK':
        modulated = fskModulation(bits, freq0, freq1, samplesPerBit);
        break;
      case 'PSK':
        modulated = pskModulation(bits, carrierFreq, samplesPerBit);
        break;
      default:
        modulated = askModulation(bits, carrierFreq, samplesPerBit);
    }

    setModulatedData(modulated);
    if (onModulate) {
      // Allow hook to recompute and store
      onModulate(binaryData, modulationType, { carrierFreq, freq0, freq1, samplesPerBit });
    }

    // Auto-demodulate
    const demodulated = simpleDemodulation(modulated.signal, samplesPerBit);
    setDemodulatedBits(demodulated);
    if (onDemodulate) {
      onDemodulate(modulated);
    }
  };

  const handleParameterChange = (param, value) => {
    switch (param) {
      case 'modulationType':
        setModulationType(value);
        break;
      case 'carrierFreq':
        setCarrierFreq(parseFloat(value));
        break;
      case 'freq0':
        setFreq0(parseFloat(value));
        break;
      case 'freq1':
        setFreq1(parseFloat(value));
        break;
      case 'samplesPerBit':
        setSamplesPerBit(parseInt(value));
        break;
    }
    
    if (onUpdateParameters) {
      onUpdateParameters({ [param]: value });
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Step 7: Modulation and Demodulation
        </h2>
        <p className="text-gray-600 mb-4">
          Convert digital signals to analog for transmission over analog channels, 
          then recover the digital data at the receiver.
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Modulation Parameters</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Modulation Type
            </label>
            <select
              value={modulationType}
              onChange={(e) => handleParameterChange('modulationType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ASK">ASK (Amplitude Shift Keying)</option>
              <option value="FSK">FSK (Frequency Shift Keying)</option>
              <option value="PSK">PSK (Phase Shift Keying)</option>
            </select>
          </div>

          {(modulationType === 'ASK' || modulationType === 'PSK') && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Carrier Frequency: {carrierFreq} Hz
              </label>
              <input
                type="range"
                min="5"
                max="20"
                step="0.5"
                value={carrierFreq}
                onChange={(e) => handleParameterChange('carrierFreq', e.target.value)}
                className="slider w-full"
              />
            </div>
          )}

          {modulationType === 'FSK' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency for '0': {freq0} Hz
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  step="0.5"
                  value={freq0}
                  onChange={(e) => handleParameterChange('freq0', e.target.value)}
                  className="slider w-full"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Frequency for '1': {freq1} Hz
                </label>
                <input
                  type="range"
                  min="8"
                  max="20"
                  step="0.5"
                  value={freq1}
                  onChange={(e) => handleParameterChange('freq1', e.target.value)}
                  className="slider w-full"
                />
              </div>
            </>
          )}

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Samples per Bit: {samplesPerBit}
            </label>
            <input
              type="range"
              min="50"
              max="200"
              value={samplesPerBit}
              onChange={(e) => handleParameterChange('samplesPerBit', e.target.value)}
              className="slider w-full"
            />
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Modulation Types</h3>
          <div className="text-sm text-gray-700 space-y-2">
            <div>
              <strong>ASK:</strong> Varies amplitude
              <ul className="ml-4 mt-1">
                <li>• '1' = carrier signal</li>
                <li>• '0' = no signal</li>
              </ul>
            </div>
            <div>
              <strong>FSK:</strong> Varies frequency
              <ul className="ml-4 mt-1">
                <li>• '1' = high frequency</li>
                <li>• '0' = low frequency</li>
              </ul>
            </div>
            <div>
              <strong>PSK:</strong> Varies phase
              <ul className="ml-4 mt-1">
                <li>• '1' = 0° phase</li>
                <li>• '0' = 180° phase</li>
              </ul>
            </div>
          </div>
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

      {/* Modulated Signal */}
      {modulatedData && (
        <div className="mb-6">
          <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-3 text-gray-800">
              {modulationType} Modulated Signal
            </h3>
            <WaveformChart
              waveformData={{
                signal: modulatedData.signal.slice(0, 500),
                timeAxis: modulatedData.timeAxis.slice(0, 500),
                encoding: `${modulationType} Signal`
              }}
              title={`${modulationType} Modulation Visualization`}
              height={350}
              colors={["#EF4444"]}
              yAxisLabel="Amplitude"
              xAxisLabel="Time"
            />
          </div>
        </div>
      )}

      {/* Demodulation Results */}
      {demodulatedBits && (
        <div className="mb-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">Demodulation Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-green-700 mb-2">Original Binary:</h4>
                <div className="font-mono text-xs bg-white p-2 rounded border break-all">
                  {binaryData}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-green-700 mb-2">Recovered Binary:</h4>
                <div className="font-mono text-xs bg-white p-2 rounded border break-all">
                  {demodulatedBits.join('')}
                </div>
              </div>
            </div>
            <div className="mt-3 text-sm text-green-700">
              <strong>Match:</strong> {binaryData === demodulatedBits.join('') ? 
                '✅ Perfect recovery' : '❌ Some errors detected'}
            </div>
          </div>
        </div>
      )}

      {/* Explanation */}
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-2">💡 How it works:</h3>
        <div className="text-sm text-yellow-700">
          <p className="mb-2">
            <strong>Digital Modulation:</strong>
          </p>
          <ul className="space-y-1 ml-4">
            <li>• <strong>Modulation:</strong> Converts digital bits to analog signals</li>
            <li>• <strong>Carrier:</strong> High-frequency sine wave modified by data</li>
            <li>• <strong>ASK:</strong> Amplitude varies (on/off keying)</li>
            <li>• <strong>FSK:</strong> Frequency varies between two values</li>
            <li>• <strong>PSK:</strong> Phase shifts by 180° for different bits</li>
            <li>• <strong>Demodulation:</strong> Recovers original digital data</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModulationDemodulationStep;