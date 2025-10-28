'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Router, Laptop, Server, HelpCircle } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import gsap from 'gsap';
import { useToast } from '@/hooks/use-toast';

const devices = [
  { id: 'A', mac: '0A:1B:2C:3D:4E:01', port: 1, component: Laptop },
  { id: 'B', mac: '0A:1B:2C:3D:4E:02', port: 2, component: Server },
  { id: 'C', mac: '0A:1B:2C:3D:4E:03', port: 3, component: Laptop },
];

type MacTableEntry = { mac: string; port: number };

export default function SwitchForwarding() {
  const [macTable, setMacTable] = useState<MacTableEntry[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const runSimulation = (
    srcDevice: (typeof devices)[0],
    destDevice: (typeof devices)[0]
  ) => {
    if (isSimulating) return;
    setIsSimulating(true);

    const tl = gsap.timeline({ onComplete: () => setIsSimulating(false) });
    const packet = containerRef.current!.querySelector('.packet') as HTMLElement;
    const srcEl = containerRef.current!.querySelector(
      `#dev-${srcDevice.id}`
    ) as HTMLElement;
    const switchEl = containerRef.current!.querySelector(
      '#switch-icon'
    ) as HTMLElement;

    const startX = srcEl.offsetLeft + srcEl.offsetWidth / 2;
    const startY = srcEl.offsetTop + srcEl.offsetHeight / 2;
    const switchX = switchEl.offsetLeft + switchEl.offsetWidth / 2;
    const switchY = switchEl.offsetTop + switchEl.offsetHeight / 2;

    tl.set(packet, { x: startX, y: startY, autoAlpha: 1 });
    tl.to(packet, {
      x: switchX,
      y: switchY,
      duration: 1,
      ease: 'power1.inOut',
    });

    tl.call(() => {
      // MAC learning
      if (!macTable.some((entry) => entry.mac === srcDevice.mac)) {
        setMacTable((prev) => [...prev, { mac: srcDevice.mac, port: srcDevice.port }]);
        toast({
          title: 'MAC Address Learned',
          description: `Switch added ${srcDevice.mac} on port ${srcDevice.port} to its table.`,
        });
      }
    });

    const destEntry = macTable.find((entry) => entry.mac === destDevice.mac);

    if (destEntry) {
      // Forwarding
      const destEl = containerRef.current!.querySelector(
        `#dev-${destDevice.id}`
      ) as HTMLElement;
      const endX = destEl.offsetLeft + destEl.offsetWidth / 2;
      const endY = destEl.offsetTop + destEl.offsetHeight / 2;
      tl.to(packet, { x: endX, y: endY, duration: 1, ease: 'power1.inOut' });
      tl.call(() =>
        toast({
          title: 'Frame Forwarded',
          description: `Destination found in table. Forwarding to port ${destEntry.port}.`,
        })
      );
    } else {
      // Flooding
      tl.to(packet, { scale: 1.2, duration: 0.2, repeat: 1, yoyo: true });
      tl.call(() =>
        toast({
          title: 'Destination Unknown: Flooding',
          description: `Switch is flooding the frame to all ports except the source port.`,
          variant: 'destructive',
        })
      );
    }
    tl.to(packet, { autoAlpha: 0, duration: 0.5 });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-4">
        <div
          ref={containerRef}
          className="relative h-64 border rounded-lg bg-background p-4 flex justify-between items-center"
        >
          <div
            id="switch-icon"
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          >
            <Router className="w-20 h-20 text-primary" />
            <p>Switch</p>
          </div>
          {devices.map((device) => (
            <div
              key={device.id}
              id={`dev-${device.id}`}
              className="flex flex-col items-center gap-1"
            >
              <device.component className="w-10 h-10 text-accent" />
              <span className="text-sm font-semibold">{`Device ${device.id}`}</span>
              <span className="text-xs font-code">{device.mac}</span>
              <span className="text-xs text-muted-foreground">{`Port ${device.port}`}</span>
            </div>
          ))}
          <div className="packet absolute w-5 h-5 bg-accent rounded-full opacity-0 -translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => runSimulation(devices[0], devices[1])}
            disabled={isSimulating}
          >
            Send A {'->'} B
          </Button>
          <Button
            onClick={() => runSimulation(devices[2], devices[0])}
            disabled={isSimulating}
          >
            Send C {'->'} A
          </Button>
           <Button
            onClick={() => {
                setMacTable([]);
                toast({title: "MAC table cleared!"});
            }}
            disabled={isSimulating}
            variant="outline"
          >
            Clear MAC Table
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Switch MAC Address Table</h3>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MAC Address</TableHead>
                <TableHead>Port</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {macTable.length > 0 ? (
                macTable.map((entry) => (
                  <TableRow key={entry.mac}>
                    <TableCell className="font-code">{entry.mac}</TableCell>
                    <TableCell>{entry.port}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="text-center text-muted-foreground">
                    Table is empty.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
