'use client';

import React, { useState, useRef, useLayoutEffect } from 'react';
import type { Frame } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Binary } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { frameToBinary } from '@/lib/crc';
import gsap from 'gsap';

type BitStuffingProps = {
  frame: Frame | null;
  stuffedData: string;
  setStuffedData: (data: string) => void;
};

const applyBitStuffing = (binaryData: string): [string, number[]] => {
  let count = 0;
  let result = '';
  const stuffedIndexes: number[] = [];
  for (let i = 0; i < binaryData.length; i++) {
    const bit = binaryData[i];
    if (bit === '1') {
      count++;
    } else {
      count = 0;
    }
    result += bit;
    if (count === 5) {
      result += '0';
      stuffedIndexes.push(result.length - 1);
      count = 0;
    }
  }
  return [result, stuffedIndexes];
};

export default function BitStuffing({
  frame,
  stuffedData,
  setStuffedData,
}: BitStuffingProps) {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);
  const [stuffedIndexes, setStuffedIndexes] = useState<number[]>([]);

  const fullBinaryFrame =
    frame && frame.crc
      ? frameToBinary(frame.destMac, frame.srcMac, frame.payload, frame.vlanTag) + frame.crc
      : '';

  const handleStuffBits = () => {
    if (!fullBinaryFrame) {
      toast({
        variant: 'destructive',
        title: 'Cannot Perform Bit Stuffing',
        description: 'A complete frame with CRC is required.',
      });
      return;
    }

    const [stuffed, indexes] = applyBitStuffing(fullBinaryFrame);
    setStuffedData(stuffed);
    setStuffedIndexes(indexes);
    toast({
      title: 'Bit Stuffing Applied',
      description: `${indexes.length} zero(s) were inserted to prevent false frame delimiters.`,
    });
  };

  useLayoutEffect(() => {
    if (stuffedData) {
      gsap.context(() => {
        gsap.from('.stuffed-bit', {
          scale: 2,
          opacity: 0,
          duration: 0.5,
          ease: 'back.out(2)',
          stagger: 0.1,
        });
      }, containerRef);
    }
  }, [stuffedData]);

  const displayedData = stuffedData || fullBinaryFrame;

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="flex items-center gap-4">
        <Button onClick={handleStuffBits} disabled={!fullBinaryFrame}>
          <Binary className="mr-2 h-4 w-4" /> Apply Bit Stuffing
        </Button>
      </div>
      <Alert>
        <Binary className="h-4 w-4" />
        <AlertTitle>Frame Data (pre-stuffing)</AlertTitle>
        <AlertDescription className="font-code break-all text-xs max-h-32 overflow-y-auto">
          {fullBinaryFrame || 'Waiting for a complete frame...'}
        </AlertDescription>
      </Alert>

      {stuffedData && (
        <Alert className="border-accent">
          <Binary className="h-4 w-4" />
          <AlertTitle>Frame Data (post-stuffing)</AlertTitle>
          <AlertDescription className="font-code break-all text-xs max-h-32 overflow-y-auto">
            {displayedData.split('').map((bit, index) => (
              <span
                key={index}
                className={
                  stuffedIndexes.includes(index)
                    ? 'stuffed-bit text-accent font-bold bg-accent/20 rounded-sm'
                    : ''
                }
              >
                {bit}
              </span>
            ))}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
