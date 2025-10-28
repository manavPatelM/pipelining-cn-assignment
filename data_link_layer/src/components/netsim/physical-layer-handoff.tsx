'use client';

import React, { useRef } from 'react';
import type { Frame } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Waves } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import gsap from 'gsap';

type PhysicalLayerHandoffProps = {
  finalFrame: Frame | null;
  stuffedData: string;
};

const SignalWave = () => {
  const pathRef = useRef<SVGPathElement>(null);

  const animateSignal = () => {
    if (!pathRef.current) return;
    const length = pathRef.current.getTotalLength();
    gsap.set(pathRef.current, { strokeDasharray: length, strokeDashoffset: length });
    gsap.to(pathRef.current, {
      strokeDashoffset: 0,
      duration: 3,
      ease: 'none',
      repeat: -1,
    });
  };

  React.useEffect(() => {
    animateSignal();
  }, []);

  return (
    <svg
      width="100%"
      height="80"
      viewBox="0 0 400 80"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        ref={pathRef}
        d="M 0 40 C 50 10, 50 70, 100 40 S 150 10, 200 40 S 250 70, 300 40 S 350 10, 400 40"
        stroke="hsl(var(--accent))"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default function PhysicalLayerHandoff({
  finalFrame,
  stuffedData,
}: PhysicalLayerHandoffProps) {
  const { toast } = useToast();
  const [isTransmitting, setIsTransmitting] = React.useState(false);
  const containerRef = useRef(null);

  const handleTransmit = () => {
    if (!finalFrame || !finalFrame.crc || !stuffedData) {
      toast({
        variant: 'destructive',
        title: 'Transmission Failed',
        description: 'A complete, stuffed frame with CRC is needed for transmission.',
      });
      return;
    }
    setIsTransmitting(true);
    toast({
      title: 'Transmission Started!',
      description: 'Frame is being encoded into signals on the physical medium.',
    });
    gsap.fromTo(
      containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.inOut' }
    );
  };

  return (
    <div className="space-y-6">
      <Button onClick={handleTransmit} disabled={!finalFrame?.crc || !stuffedData}>
        <Waves className="mr-2 h-4 w-4" /> Transmit Frame
      </Button>

      {isTransmitting ? (
        <div ref={containerRef} className="opacity-0">
          <Alert>
            <Waves className="h-4 w-4" />
            <AlertTitle>Frame on the Wire!</AlertTitle>
            <AlertDescription>
              The bit stream is now being transmitted as physical signals (e.g.,
              electrical pulses, light flashes, or radio waves).
            </AlertDescription>
          </Alert>
          <div className="mt-4 p-4 border rounded-lg bg-background">
            <SignalWave />
          </div>
        </div>
      ) : (
        <Alert variant="destructive">
            <AlertTitle>Awaiting Final Frame</AlertTitle>
            <AlertDescription>
              Complete all previous steps to prepare the frame for transmission.
            </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
