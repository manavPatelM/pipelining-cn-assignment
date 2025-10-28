'use client';

import React, { useState, useMemo, useRef } from 'react';
import type { Frame } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  CheckCircle2,
  XCircle,
  Calculator,
  Binary,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { calculateCRC, frameToBinary, validateCRC, CrcStep } from '@/lib/crc';
import { useToast } from '@/hooks/use-toast';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

type CrcCalculatorProps = {
  frame: Frame | null;
  setFrame: (frame: Frame | null) => void;
};

export default function CrcCalculator({ frame, setFrame }: CrcCalculatorProps) {
  const { toast } = useToast();
  const [calculation, setCalculation] = useState<{
    crc: string;
    steps: CrcStep[];
  } | null>(null);
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    remainder: string;
  } | null>(null);
  const [introduceError, setIntroduceError] = useState(false);
  const stepsContainerRef = useRef<HTMLDivElement>(null);

  const binaryFrameData = useMemo(() => {
    if (!frame) return '';
    return frameToBinary(frame.destMac, frame.srcMac, frame.payload, frame.vlanTag);
  }, [frame]);

  const handleCalculate = () => {
    if (!binaryFrameData) {
      toast({
        variant: 'destructive',
        title: 'Cannot Calculate CRC',
        description: 'Construct a frame first before calculating CRC.',
      });
      return;
    }
    const result = calculateCRC(binaryFrameData);
    setCalculation(result);
    setFrame({ ...frame!, crc: result.crc });
    setValidationResult(null);

    gsap.fromTo(
      stepsContainerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 }
    );
  };

  const handleValidate = () => {
    if (!frame || !frame.crc) {
      toast({
        variant: 'destructive',
        title: 'Cannot Validate',
        description: 'A frame with a calculated CRC is required for validation.',
      });
      return;
    }
    let dataToValidate = binaryFrameData + frame.crc;
    if (introduceError) {
      const errorPosition = Math.floor(dataToValidate.length / 2);
      const originalBit = dataToValidate[errorPosition];
      const flippedBit = originalBit === '0' ? '1' : '0';
      dataToValidate =
        dataToValidate.substring(0, errorPosition) +
        flippedBit +
        dataToValidate.substring(errorPosition + 1);
      toast({
        title: 'Error Introduced!',
        description: `A bit was flipped for validation demonstration.`,
        variant: 'destructive'
      });
    }
    const result = validateCRC(dataToValidate);
    setValidationResult(result);
  };

  return (
    <div className="space-y-6">
      <Alert>
        <Calculator className="h-4 w-4" />
        <AlertTitle>Note on CRC-32</AlertTitle>
        <AlertDescription>
          For clear visualization, this simulation uses a simplified CRC-8. The
          underlying mathematical principle of polynomial division is identical
          to CRC-32, just on a smaller scale.
        </AlertDescription>
      </Alert>

      <div className="flex flex-wrap gap-4 items-center">
        <Button onClick={handleCalculate} disabled={!frame}>
          <Binary className="mr-2 h-4 w-4" /> Generate CRC
        </Button>
        <div className="flex items-center space-x-2">
          <Switch
            id="error-switch"
            checked={introduceError}
            onCheckedChange={setIntroduceError}
            disabled={!frame?.crc}
          />
          <Label htmlFor="error-switch">Introduce Error for Validation</Label>
        </div>
        <Button onClick={handleValidate} disabled={!frame?.crc} variant="secondary">
          <ShieldCheck className="mr-2 h-4 w-4" /> Validate CRC
        </Button>
      </div>

      {calculation && (
        <div className="p-4 border rounded-lg bg-background" ref={stepsContainerRef}>
          <h3 className="font-bold text-lg mb-2">CRC Generation Complete</h3>
          <p>
            Generated CRC: <span className="font-code text-accent font-bold">{calculation.crc}</span>
          </p>
          <div className="mt-4 p-2 bg-muted rounded-md max-h-60 overflow-y-auto">
            <h4 className="font-semibold">Calculation Steps:</h4>
            <div className="text-xs font-code space-y-1">
                {calculation.steps.map((step, i) => (
                    <p key={i}>{i+1}. {step.description} {step.result && `-> ${step.result}`}</p>
                ))}
            </div>
          </div>
        </div>
      )}

      {validationResult && (
        <Alert
          variant={validationResult.isValid ? 'default' : 'destructive'}
          className="mt-4"
        >
          {validationResult.isValid ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <AlertTitle>
            {validationResult.isValid
              ? 'Validation Successful!'
              : 'Validation Failed!'}
          </AlertTitle>
          <AlertDescription>
            The calculated remainder is{' '}
            <span className="font-code font-semibold">
              {validationResult.remainder}
            </span>
            .
            {validationResult.isValid
              ? ' A zero remainder means the frame is likely error-free.'
              : ' A non-zero remainder indicates data corruption during transmission.'}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
