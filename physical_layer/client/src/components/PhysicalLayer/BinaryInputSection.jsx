import React, { useState } from 'react';
import { validateBinaryInput } from '../../utils/physicalLayerUtils';

const BinaryInputSection = ({ 
  userInput, 
  setUserInput, 
  inputError, 
  setInputError, 
  onValidInput, 
  title = "Custom Binary Input" 
}) => {
  const handleInputChange = (e) => {
    const input = e.target.value;
    setUserInput(input);
    
    const validation = validateBinaryInput(input);
    if (validation.isValid) {
      setInputError('');
      onValidInput(validation.cleanedInput);
    } else {
      setInputError(validation.error);
    }
  };

  return (
    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
      <h3 className="font-semibold text-green-800 mb-3">{title}</h3>
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Binary String (max 64 bits):
        </label>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="e.g., 10110101"
          className={`w-full p-3 border rounded-lg font-mono ${
            inputError
              ? 'border-red-300 bg-red-50'
              : userInput && !inputError
              ? 'border-green-300 bg-green-50'
              : 'border-gray-300'
          }`}
        />
        {inputError && (
          <p className="text-red-600 text-sm mt-1">⚠️ {inputError}</p>
        )}
        {userInput && !inputError && (
          <p className="text-green-600 text-sm mt-1">
            ✅ Valid binary string ({userInput.replace(/\s+/g, '').length} bits)
          </p>
        )}
      </div>
      <div className="text-xs text-gray-600">
        <p>• Only enter 0s and 1s</p>
        <p>• Spaces will be automatically removed</p>
        <p>• Examples: "1010", "11001100", "01010101"</p>
      </div>
    </div>
  );
};

export default BinaryInputSection;