'use client';

import React, { useRef, useLayoutEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Laptop, X, FileWarning } from 'lucide-react';
import gsap from 'gsap';
import { useToast } from '@/hooks/use-toast';

const Node = ({ id, name }: { id: string; name: string }) => (
  <div id={id} className="node absolute flex flex-col items-center">
    <Laptop className="w-10 h-10 text-primary" />
    <span className="font-semibold text-sm">{name}</span>
    <div className="w-px h-4 bg-muted-foreground"></div>
  </div>
);

export default function CsmaCd() {
  const containerRef = useRef<HTMLDivElement>(null);
  const tl = useRef<gsap.core.Timeline>();
  const { toast } = useToast();
  const [isSimulating, setIsSimulating] = useState(false);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {}, containerRef);
    return () => ctx.revert();
  }, []);

  const runSimulation = (mode: 'no-collision' | 'collision') => {
    if (isSimulating) {
      toast({ title: 'Simulation in progress...', variant: 'destructive' });
      return;
    }
    setIsSimulating(true);

    const bus = containerRef.current!.querySelector('.bus');
    const busWidth = bus!.clientWidth;
    const packetA = containerRef.current!.querySelector('.packet-a') as HTMLElement;
    const packetB = containerRef.current!.querySelector('.packet-b') as HTMLElement;
    const collision = containerRef.current!.querySelector('.collision') as HTMLElement;

    tl.current = gsap.timeline({
      onComplete: () => setIsSimulating(false),
    });

    // Reset positions
    gsap.set([packetA, packetB, collision], { autoAlpha: 0, x: 0 });

    tl.current.to(packetA, { autoAlpha: 1, duration: 0.1 });

    if (mode === 'no-collision') {
      tl.current.to(packetA, {
        x: busWidth,
        duration: 2,
        ease: 'linear',
      });
      tl.current.to(packetA, { autoAlpha: 0, duration: 0.1 });
    } else {
      tl.current.to(
        packetA,
        {
          x: busWidth / 2 - 20,
          duration: 1,
          ease: 'linear',
        },
        'start'
      );
      tl.current.to(
        packetB,
        {
          autoAlpha: 1,
          duration: 0.1,
        },
        'start+=0.2'
      );
      tl.current.to(
        packetB,
        {
          x: -(busWidth / 2 - 20),
          duration: 1,
          ease: 'linear',
        },
        'start+=0.2'
      );
      tl.current.to(
        collision,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.2,
          onComplete: () =>
            toast({
              title: 'Collision Detected!',
              description: 'Both nodes are sending a jam signal and will back off.',
              variant: 'destructive',
            }),
        },
        'start+=1'
      );
      tl.current.to([packetA, packetB], { backgroundColor: '#ef4444', duration: 0.2 }, 'start+=1');
      tl.current.to(collision, { autoAlpha: 0, scale: 0.5, duration: 0.3, delay: 0.5 });
      tl.current.to([packetA, packetB], { autoAlpha: 0, duration: 0.2 });
    }
  };

  return (
    <div className="space-y-6" ref={containerRef}>
      <div className="flex flex-wrap gap-4">
        <Button onClick={() => runSimulation('no-collision')} disabled={isSimulating}>
          Simulate Successful Transmission
        </Button>
        <Button onClick={() => runSimulation('collision')} disabled={isSimulating} variant="destructive">
          Simulate Collision
        </Button>
      </div>

      <div className="relative w-full h-40 bg-background p-4 rounded-lg border">
        <div className="bus absolute top-1/2 left-0 w-full h-1 bg-muted-foreground transform -translate-y-1/2"></div>
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="collision opacity-0" style={{ transform: 'scale(0.5)' }}>
                <FileWarning className="w-12 h-12 text-destructive" />
            </div>
        </div>

        <div id="nodeA" className="absolute top-1/2 left-[10%] transform -translate-y-full">
          <Node id="node-a-visual" name="Node A" />
          <div className="packet packet-a absolute top-1/2 left-full w-8 h-5 bg-accent rounded-sm opacity-0 transform -translate-y-1/2"></div>
        </div>
        
        <div id="nodeB" className="absolute top-1/2 right-[10%] transform -translate-y-full">
          <Node id="node-b-visual" name="Node B" />
          <div className="packet packet-b absolute top-1/2 right-full w-8 h-5 bg-accent rounded-sm opacity-0 transform -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
}
