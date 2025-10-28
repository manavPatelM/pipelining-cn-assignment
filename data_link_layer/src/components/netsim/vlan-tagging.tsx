'use client';

import React, { useRef } from 'react';
import type { Frame } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import gsap from 'gsap';

type VlanTaggingProps = {
  frame: Frame | null;
  setFrame: (frame: Frame | null) => void;
};

const FramePart = ({
  label,
  value,
  color,
  className,
  isNew,
}: {
  label: string;
  value: string;
  color: string;
  className?: string;
  isNew?: boolean;
}) => (
  <div
    className={`flex flex-col items-center justify-center p-3 rounded-md text-center ${color} ${className} ${
      isNew ? 'vlan-tag-part' : ''
    }`}
  >
    <div className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">
      {label}
    </div>
    <div className="font-code text-primary-foreground font-bold text-sm md:text-base break-all">
      {value || '...'}
    </div>
  </div>
);

export default function VlanTagging({ frame, setFrame }: VlanTaggingProps) {
  const { toast } = useToast();
  const [vlanId, setVlanId] = React.useState('10');
  const containerRef = useRef(null);

  const handleTagFrame = () => {
    if (!frame) {
      toast({
        variant: 'destructive',
        title: 'Cannot Tag Frame',
        description: 'Construct a frame first.',
      });
      return;
    }
    const taggedFrame = { ...frame, vlanTag: vlanId };
    setFrame(taggedFrame);

    gsap.context(() => {
      gsap.fromTo(
        '.vlan-tag-part',
        { y: -30, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: 'elastic.out(1, 0.5)',
        }
      );
    }, containerRef);

    toast({
      title: 'Frame Tagged for VLAN',
      description: `The frame is now part of VLAN ${vlanId}.`,
    });
  };

  return (
    <div ref={containerRef} className="space-y-6">
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <Label htmlFor="vlan-id">VLAN ID</Label>
          <Input
            id="vlan-id"
            value={vlanId}
            onChange={(e) => setVlanId(e.target.value)}
            className="w-32"
          />
        </div>
        <Button onClick={handleTagFrame} disabled={!frame}>
          <Tag className="mr-2 h-4 w-4" /> Add VLAN Tag
        </Button>
      </div>
      <div className="p-4 bg-muted rounded-lg">
        <h3 className="text-center font-semibold mb-4 text-lg">
          Tagged Frame Structure
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          <FramePart
            label="Dest MAC"
            value={frame?.destMac ?? ''}
            color="bg-primary/70"
          />
          <FramePart
            label="Source MAC"
            value={frame?.srcMac ?? ''}
            color="bg-primary/80"
          />
          {frame?.vlanTag && (
            <FramePart
              label="VLAN Tag"
              value={frame.vlanTag}
              color="bg-accent"
              isNew
            />
          )}
          <FramePart
            label="Payload"
            value={frame?.payload ?? ''}
            color="bg-primary"
            className={!frame?.vlanTag ? "col-span-2 lg:col-span-1" : ""}
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
