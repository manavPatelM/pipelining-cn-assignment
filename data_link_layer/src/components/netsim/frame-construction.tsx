'use client';

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import gsap from 'gsap';
import type { Frame } from '@/app/page';

type FrameConstructionProps = {
  senderMac: string;
  receiverMac: string;
  data: string;
  setData: (data: string) => void;
  frame: Frame | null;
  setFrame: (frame: Frame | null) => void;
};

const FramePart = ({
  label,
  value,
  color,
  className,
}: {
  label: string;
  value: string;
  color: string;
  className?: string;
}) => (
  <div
    className={`frame-part flex flex-col items-center justify-center p-3 rounded-md text-center ${color} ${className}`}
  >
    <div className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">
      {label}
    </div>
    <div className="font-code text-primary-foreground font-bold text-sm md:text-base break-all">
      {value || '...'}
    </div>
  </div>
);

export default function FrameConstruction({
  senderMac,
  receiverMac,
  data,
  setData,
  frame,
  setFrame,
}: FrameConstructionProps) {
  const { toast } = useToast();
  const containerRef = useRef(null);

  const handleConstructFrame = () => {
    const newFrame = {
      destMac: receiverMac,
      srcMac: senderMac,
      payload: data,
      crc: '', // To be calculated later
    };
    setFrame(newFrame);

    gsap.context(() => {
      gsap.fromTo(
        '.frame-part',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.7)',
        }
      );
    }, containerRef);

    toast({
      title: 'Frame Assembled',
      description:
        'The packet has been encapsulated with header and trailer placeholders.',
    });
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <Label htmlFor="payload-data">Payload (Packet Data)</Label>
          <Input
            id="payload-data"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
        </div>
        <Button onClick={handleConstructFrame}>Construct Frame</Button>
      </div>

      <div className="p-4 bg-muted rounded-lg">
        <h3 className="text-center font-semibold mb-4 text-lg">
          Ethernet II Frame Structure
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          <FramePart
            label="Destination MAC"
            value={frame?.destMac ?? ''}
            color="bg-primary/70"
          />
          <FramePart
            label="Source MAC"
            value={frame?.srcMac ?? ''}
            color="bg-primary/80"
          />
          <FramePart
            label="Payload"
            value={frame?.payload ?? ''}
            color="bg-primary"
            className="sm:col-span-2 lg:col-span-1"
          />
          <FramePart
            label="CRC"
            value={frame?.crc ? 'Generated' : ''}
            color="bg-accent/80"
          />
        </div>
      </div>
    </div>
  );
}
