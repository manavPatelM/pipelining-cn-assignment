'use client';

import React, { useRef, useLayoutEffect } from 'react';
import { Laptop, Server, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import gsap from 'gsap';

type MacAssignmentProps = {
  senderMac: string;
  setSenderMac: (mac: string) => void;
  receiverMac: string;
  setReceiverMac: (mac: string) => void;
};

export default function MacAssignment({
  senderMac,
  setSenderMac,
  receiverMac,
  setReceiverMac,
}: MacAssignmentProps) {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleAssign = () => {
    gsap.context(() => {
      gsap.fromTo(
        '.mac-address-text',
        { opacity: 0, y: -20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.2,
          ease: 'power2.out',
        }
      );
    }, containerRef);
    toast({
      title: 'MAC Addresses Assigned',
      description: 'Sender and receiver nodes are now identified on the network.',
    });
  };

  return (
    <div ref={containerRef}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-background">
          <Label htmlFor="sender-mac" className="text-lg font-semibold">
            Sender Node
          </Label>
          <Laptop className="w-16 h-16 text-accent" />
          <Input
            id="sender-mac"
            value={senderMac}
            onChange={(e) => setSenderMac(e.target.value)}
            className="font-code text-center"
            aria-label="Sender MAC Address"
          />
          <p className="mac-address-text text-primary font-medium opacity-0">
            {senderMac}
          </p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <ArrowRight
            className="w-12 h-12 text-muted-foreground hidden md:block"
            aria-hidden="true"
          />
          <Button onClick={handleAssign} className="w-full md:w-auto">
            Assign Addresses
          </Button>
        </div>

        <div className="flex flex-col items-center gap-4 p-4 border rounded-lg bg-background">
          <Label htmlFor="receiver-mac" className="text-lg font-semibold">
            Receiver Node
          </Label>
          <Server className="w-16 h-16 text-accent" />
          <Input
            id="receiver-mac"
            value={receiverMac}
            onChange={(e) => setReceiverMac(e.target.value)}
            className="font-code text-center"
            aria-label="Receiver MAC Address"
          />
          <p className="mac-address-text text-primary font-medium opacity-0">
            {receiverMac}
          </p>
        </div>
      </div>
    </div>
  );
}
