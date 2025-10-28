# **App Name**: NetSim

## Core Features:

- MAC Address Assignment: Simulate assigning unique MAC addresses to sender and receiver nodes.
- Frame Construction: Build frame structure with header (MAC addresses) and trailer (CRC).
- CRC-32 Generation: Implement CRC-32 algorithm to generate error detection codes for frames. Show the internal process and highlight possible errors in the messages using the animation system.
- CRC Validation: Simulate CRC validation at the receiver end to detect errors. Show how frames can fail and the tool validates each message using error-checking.
- Bit Stuffing: Implement bit stuffing to mark frame boundaries for proper transmission. Show the result of the function using animated graphical displays.
- Collision Detection (CSMA/CD): Simulate collision detection using CSMA/CD protocol.
- Switch Forwarding Simulation: Simulate a network switch forwarding frames based on MAC address tables. Visualize the flow with smooth, animated transitions.

## Style Guidelines:

- Primary color: Dark blue (#2E3192) for a tech-focused, professional feel.
- Background color: Very light blue (#E6F0FF) provides a clean backdrop.
- Accent color: Teal (#238E8E) will draw attention to interactive elements.
- Font: 'Inter', a sans-serif font for clear readability in both headlines and body text.
- Use simple, outlined icons to represent network devices and data packets.
- Employ a clear, modular layout with distinct sections for each simulation step.
- Utilize GSAP animations for smooth transitions, interactive UI elements, and visualizing data flow.