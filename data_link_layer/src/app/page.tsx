'use client';

import React, { useState } from 'react';
import Header from '@/components/netsim/header';
import MacAssignment from '@/components/netsim/mac-assignment';
import FrameConstruction from '@/components/netsim/frame-construction';
import CrcCalculator from '@/components/netsim/crc-calculator';
import BitStuffing from '@/components/netsim/bit-stuffing';
import CsmaCd from '@/components/netsim/csma-cd';
import SwitchForwarding from '@/components/netsim/switch-forwarding';
import VlanTagging from '@/components/netsim/vlan-tagging';
import PhysicalLayerHandoff from '@/components/netsim/physical-layer-handoff';
import SimulationWrapper from '@/components/netsim/simulation-wrapper';

export type Frame = {
  destMac: string;
  srcMac: string;
  vlanTag?: string;
  payload: string;
  crc: string;
};

export default function Home() {
  const [senderMac, setSenderMac] = useState('0A:1B:2C:3D:4E:5F');
  const [receiverMac, setReceiverMac] = useState('F9:E8:D7:C6:B5:A4');
  const [data, setData] = useState('Hello NetSim!');
  const [frame, setFrame] = useState<Frame | null>(null);
  const [stuffedData, setStuffedData] = useState('');

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 space-y-12 container mx-auto px-4 py-8 md:px-6 lg:py-16">
        <SimulationWrapper
          id="mac-assignment"
          title="1. MAC Address Assignment"
          description="Assign unique Media Access Control (MAC) addresses to sender and receiver nodes. A MAC address is a hardware identifier that uniquely identifies each device on a network."
        >
          <MacAssignment
            senderMac={senderMac}
            setSenderMac={setSenderMac}
            receiverMac={receiverMac}
            setReceiverMac={setReceiverMac}
          />
        </SimulationWrapper>

        <SimulationWrapper
          id="frame-construction"
          title="2. Frame Construction"
          description="Encapsulate network-layer packets into Data Link layer frames. A frame consists of a header, payload (the packet), and a trailer."
        >
          <FrameConstruction
            senderMac={senderMac}
            receiverMac={receiverMac}
            data={data}
            setData={setData}
            frame={frame}
            setFrame={setFrame}
          />
        </SimulationWrapper>

        <SimulationWrapper
          id="crc"
          title="3. CRC Generation & Validation"
          description="Calculate a Cyclic Redundancy Check (CRC) for error detection. The sender computes and appends a CRC value; the receiver re-computes it to check for transmission errors."
        >
          <CrcCalculator frame={frame} setFrame={setFrame} />
        </SimulationWrapper>

        <SimulationWrapper
          id="bit-stuffing"
          title="4. Bit Stuffing"
          description="Prevent control sequences from appearing in the data. A '0' is inserted (stuffed) after every five consecutive '1's in the data stream to differentiate data from frame delimiters."
        >
          <BitStuffing
            frame={frame}
            stuffedData={stuffedData}
            setStuffedData={setStuffedData}
          />
        </SimulationWrapper>

        <SimulationWrapper
          id="csma-cd"
          title="5. Collision Detection (CSMA/CD)"
          description="Simulate Carrier Sense Multiple Access with Collision Detection. Nodes listen before transmitting and can detect when two or more nodes transmit simultaneously, causing a collision."
        >
          <CsmaCd />
        </SimulationWrapper>

        <SimulationWrapper
          id="switch-forwarding"
          title="6. Switch Forwarding"
          description="Observe how a network switch forwards frames. The switch learns MAC addresses and uses a table to send frames only to the correct destination port, reducing network congestion."
        >
          <SwitchForwarding />
        </SimulationWrapper>

        <SimulationWrapper
          id="vlan-tagging"
          title="7. VLAN Tagging"
          description="Explore how Virtual LANs (VLANs) segment a network. Frames are 'tagged' with a VLAN ID, allowing switches to isolate traffic between different logical networks on the same physical infrastructure."
        >
          <VlanTagging frame={frame} setFrame={setFrame} />
        </SimulationWrapper>

        <SimulationWrapper
          id="physical-layer"
          title="8. Handoff to Physical Layer"
          description="The final step: the complete, error-checked frame is passed to the Physical Layer for conversion into binary signals (bits) and transmission over the physical medium."
        >
          <PhysicalLayerHandoff finalFrame={frame} stuffedData={stuffedData} />
        </SimulationWrapper>
      </main>
    </div>
  );
}
