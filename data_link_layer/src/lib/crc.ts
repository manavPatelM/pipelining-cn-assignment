// This file implements a simplified CRC-8 for educational visualization.
// The polynomial used is x^8 + x^2 + x + 1, which is 0x107 or 0x07 (normal form).

const CRC8_POLYNOMIAL = 0x107; // Generator polynomial for CRC-8

export type CrcStep = {
  description: string;
  data: string;
  remainder: string;
  xor?: string;
  result?: string;
};

export const textToBinary = (text: string): string => {
  return text
    .split('')
    .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');
};

export const macToBinary = (mac: string): string => {
  return mac.replace(/:/g, '').toLowerCase();
};

export const frameToBinary = (
  dest: string,
  src: string,
  payload: string,
  vlanTag?: string
) => {
  const payloadBinary = payload
    .split('')
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join('');

  let fullFrame =
    macToBinary(dest) +
    macToBinary(src) +
    (vlanTag ? parseInt(vlanTag, 16).toString(2).padStart(32, '0') : '') +
    payloadBinary;
    
  return fullFrame
    .split('')
    .map(c => parseInt(c, 16).toString(2).padStart(4, '0'))
    .join('');
};

export const calculateCRC = (
  binaryData: string
): { crc: string; steps: CrcStep[] } => {
  const steps: CrcStep[] = [];
  const polyBinary = (CRC8_POLYNOMIAL & 0xff).toString(2);
  const n = polyBinary.length;
  let data = binaryData + '0'.repeat(n - 1);
  let remainder = data.substring(0, n);
  data = data.substring(n);

  steps.push({
    description: `Start with data padded with ${n - 1} zeros.`,
    data: binaryData,
    remainder: '',
  });

  let stepIndex = 0;
  while (data.length > 0 || remainder.length >= n) {
      if (stepIndex > 30) { // Safety break for long data
        steps.push({
            description: "Calculation truncated for display.",
            data: '',
            remainder: remainder.padStart(n-1, '0')
        });
        break;
      }
    if (remainder[0] === '1') {
      const oldRemainder = remainder;
      const xorResult = (parseInt(remainder, 2) ^ parseInt(polyBinary, 2))
        .toString(2)
        .padStart(remainder.length, '0');
      remainder = xorResult.substring(1);
      
      steps.push({
        description: `Bit is 1. XOR with polynomial ${polyBinary}.`,
        data: oldRemainder,
        remainder: '',
        xor: polyBinary.padStart(oldRemainder.length, '0'),
        result: xorResult.padStart(oldRemainder.length, '0'),
      });
    } else {
      remainder = remainder.substring(1);
      steps.push({
        description: 'Bit is 0. Shift left.',
        data: remainder.padStart(n-1, '0'),
        remainder: ''
      });
    }

    if(data.length > 0) {
        remainder += data[0];
        data = data.substring(1);
    }
    stepIndex++;
  }

  const finalCrc = remainder.padStart(n-1, '0');
  steps.push({
    description: `Final remainder is the CRC.`,
    data: '',
    remainder: finalCrc,
  });

  return { crc: finalCrc, steps };
};

export const validateCRC = (
  dataWithCrc: string
): { isValid: boolean; remainder: string } => {
  const polyBinary = (CRC8_POLYNOMIAL & 0xff).toString(2);
  const n = polyBinary.length;
  let data = dataWithCrc;
  let remainder = data.substring(0, n);
  data = data.substring(n);

  while (data.length > 0) {
    if (remainder[0] === '1') {
      const xorResult = (parseInt(remainder, 2) ^ parseInt(polyBinary, 2))
        .toString(2)
        .padStart(remainder.length, '0');
      remainder = xorResult.substring(1);
    } else {
      remainder = remainder.substring(1);
    }
    remainder += data[0];
    data = data.substring(1);
  }

  // Final XOR
  if (remainder[0] === '1') {
    const xorResult = (parseInt(remainder, 2) ^ parseInt(polyBinary, 2))
      .toString(2)
      .padStart(remainder.length, '0');
    remainder = xorResult.substring(1);
  } else {
    remainder = remainder.substring(1);
  }
  
  const finalRemainder = remainder.padStart(n-1, '0');
  const isValid = parseInt(finalRemainder, 2) === 0;

  return { isValid, remainder: finalRemainder };
};
