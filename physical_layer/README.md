
---

# Physical Layer Transmission Simulator

This project is a **React.js application** that simulates the **Physical Layer of the OSI Model**.
It demonstrates how frames are converted into binary signals, encoded, transmitted, and affected by real-world phenomena such as **noise, attenuation, and multiplexing**, along with a **Hybrid Topology implementation**.

---

## 🎯 Goal

To provide an **interactive visualization** of **Physical Layer concepts** including:

* Binary representation
* Encoding schemes
* Transmission impairments
* Multiplexing
* Network Topology (Hybrid Topology)

---

## 📝 Features

1. **Frame to Binary Conversion**

   * Convert frame data (characters/strings) into a binary bitstream.

2. **NRZ Encoding (Non-Return-to-Zero)**

   * Generate and visualize the NRZ waveform.

3. **Manchester Encoding**

   * Implement Manchester encoding and display the waveform.

4. **NRZI Encoding (Non-Return-to-Zero Inverted)**

   * Simulate NRZI encoding logic and output signal.

5. **Noise Simulation**

   * Add random bit flips or waveform distortion to represent transmission noise.

6. **Bit Error Rate (BER) Calculation**

   * Compare transmitted and received bitstreams to calculate BER.

7. **Hybrid Topology Implementation** 

   * Simulate a **hybrid network** combining star and bus topologies.
   * Visualize clusters of devices connected to a backbone.
   * Demonstrate signal flow, speed, and noise effects.

8. **Signal Attenuation**

   * Simulate weakening of signal strength over distance.

9. **Time-Division Multiplexing (TDM)**

   * Implement TDM to transmit multiple data streams in time slots.

10. **Final Binary Waveforms**

    * Display the complete encoded and transmitted waveforms as the **end output**.

---

## ⚡ Benefits of Hybrid Topology

* **Scalability** – Easy to add more clusters without disrupting the network.
* **Flexibility** – Combines strengths of star and bus topologies.
* **Fault Tolerance** – Local failures in one cluster don’t affect the entire network.
* **Efficient Communication** – Backbone enables fast inter-cluster data transfer.

---

## 🛠️ Tech Stack

* **Frontend**: React.js, Tailwind CSS / Bootstrap (for styling)
* **Visualization**: D3.js / Chart.js / Recharts (for waveforms, topologies)
* **State Management**: React Context API or Redux

---

## 🚀 Installation & Setup

```bash
git clone https://github.com/Vruxak21/Physical-Layer-Bits-Encoding-Transmission-.git

cd physical-layer-simulator

npm install --legacy-peer-deps

npm run dev
```

---

## 📊 Example Visuals

* **Binary Bitstream** → `01001101`
* **NRZ / Manchester / NRZI Waveforms** → Step or transition graphs
* **Noise Simulation** → Distorted bitstream with errors
* **BER** → Percentage error in transmission
* **Hybrid Topology** → Star clusters connected by a bus backbone
* **TDM** → Multiple streams multiplexed in time slots

---

## 📂 Project Structure

```
physical-layer-simulator/
│── src/
│   ├── components/
│   │   ├── BitStreamInput.js
│   │   ├── NRZWaveform.js
│   │   ├── ManchesterWaveform.js
│   │   ├── NRZIWaveform.js
│   │   ├── NoiseSimulator.js
│   │   ├── BERCalculator.js
│   │   ├── HybridTopologySimulator.js   
│   │   ├── AttenuationSimulator.js
│   │   ├── TDMSimulator.js
│   │   └── FinalWaveform.js
│   ├── App.js
│   └── index.js
│── package.json
│── README.md
```

---

## 🎓 Learning Outcomes

* Understand **binary encoding schemes**.
* Simulate **transmission impairments** (noise, attenuation).
* Explore **multiplexing techniques**.
* Implement and visualize **Hybrid Topology** in networking.

---

## 📌 Future Enhancements

* Add **ASK, FSK, PSK modulation**.
* Real-time interactive sliders for **noise, distance, and speed**.
* Export results as **images/PDF** for reports.

---

## 👩‍💻 Contributors

* Parth Gupta
* Parv Shah
* Dev Patel
* Dhruvam Patel
* Divya Patel
* Het Patel
* Kunj Patel
* Monish Patel
* Priyansh Patel
* Vruxak Patel
* Dhruval Patel

---

Do you want me to also **add diagrams/ASCII visuals** of the Hybrid Topology (star + bus) in the README for clarity?
