# OSI Layer Simulator - Complete Project Explanation

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Core Features](#core-features)
6. [Component Breakdown](#component-breakdown)
7. [Data Flow](#data-flow)
8. [API Endpoints](#api-endpoints)
9. [Installation & Setup](#installation--setup)
10. [Usage Guide](#usage-guide)
11. [Customization](#customization)
12. [Deployment](#deployment)

---

## 🎯 Project Overview

The **OSI Layer Simulator** is an interactive, educational web application that visualizes how data flows through the 7 layers of the OSI (Open Systems Interconnection) model. It demonstrates the encapsulation and decapsulation process in network communication between a sender and receiver.

### Purpose
- **Educational Tool**: Help students and professionals understand network protocols
- **Visual Learning**: Interactive animations show data transformation at each layer
- **Hands-on Practice**: Simulate real network scenarios including errors
- **Professional Presentation**: Enterprise-ready UI for demonstrations

### Key Concepts Demonstrated
- **Encapsulation**: Adding headers as data moves down layers (Application → Physical)
- **Transmission**: Data transfer through the physical medium
- **Decapsulation**: Removing headers as data moves up layers (Physical → Application)
- **Protocol Headers**: Each layer adds specific protocol information
- **Error Handling**: Network errors and recovery mechanisms

---

## 🏗️ Architecture

### System Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Components  │  │    Hooks     │  │   Services   │  │
│  │  - LayerCard │  │ - useSimul.. │  │  - API       │  │
│  │  - LiveStats │  │              │  │              │  │
│  │  - Modals    │  │              │  │              │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST
┌─────────────────────────────────────────────────────────┐
│                   Backend (Express.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Routes     │  │ Controllers  │  │    Models    │  │
│  │  /api/layers │  │ - Simulate   │  │ - OSI Layers │  │
│  │  /api/trans..│  │ - Calculate  │  │ - Packets    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Design Pattern
- **Frontend**: Component-based architecture with React
- **State Management**: React Hooks (useState, useEffect, custom hooks)
- **Backend**: RESTful API with Express.js
- **Communication**: Asynchronous HTTP requests
- **Styling**: Utility-first CSS with Tailwind CSS

---

## 💻 Technology Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.x | UI framework for building interactive components |
| **Vite** | 5.x | Fast build tool and dev server |
| **Tailwind CSS** | 3.x | Utility-first CSS framework |
| **Framer Motion** | 11.x | Animation library for smooth transitions |
| **Lucide React** | Latest | Icon library for UI elements |
| **Axios** | 1.x | HTTP client for API requests |

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 14+ | JavaScript runtime |
| **Express.js** | 4.x | Web application framework |
| **CORS** | Latest | Cross-origin resource sharing |
| **dotenv** | Latest | Environment variable management |

### Development Tools
- **ESLint**: Code linting and quality
- **PostCSS**: CSS processing
- **Concurrently**: Run multiple npm scripts
- **Nodemon**: Auto-restart server on changes

---

## 📁 Project Structure

```
osi-simulator/
├── frontend/                    # React frontend application
│   ├── public/                  # Static assets
│   │   └── vite.svg            # Vite logo
│   ├── src/                     # Source code
│   │   ├── components/          # React components
│   │   │   ├── core/           # Core reusable components
│   │   │   ├── features/       # Feature-specific components
│   │   │   ├── AnimatedPacket.jsx        # Packet visualization
│   │   │   ├── BinaryVisualization.jsx   # Binary data display
│   │   │   ├── DataTransformationView.jsx # Data transformation
│   │   │   ├── ErrorSimulation.jsx       # Error handling UI
│   │   │   ├── LayerCard.jsx             # OSI layer card
│   │   │   ├── LayerSimulationFrame.jsx  # Layer simulation
│   │   │   ├── LayerSimulationSelector.jsx # Layer selector
│   │   │   ├── LiveStats.jsx             # Statistics dashboard
│   │   │   └── SimulationModal.jsx       # Layer details modal
│   │   ├── config/              # Configuration files
│   │   │   └── constants.js     # App constants
│   │   ├── hooks/               # Custom React hooks
│   │   │   └── useSimulation.js # Simulation state management
│   │   ├── services/            # API services
│   │   │   └── api.js          # API client
│   │   ├── App.jsx             # Main application component
│   │   ├── index.css           # Global styles
│   │   └── main.jsx            # Application entry point
│   ├── .env.development        # Development environment variables
│   ├── .env.production         # Production environment variables
│   ├── index.html              # HTML template
│   ├── package.json            # Frontend dependencies
│   ├── postcss.config.js       # PostCSS configuration
│   ├── tailwind.config.js      # Tailwind CSS configuration
│   └── vite.config.js          # Vite configuration
│
├── backend/                     # Express.js backend
│   ├── routes/                  # API routes
│   │   └── api.js              # API endpoints
│   ├── .env                    # Backend environment variables
│   ├── package.json            # Backend dependencies
│   └── server.js               # Express server
│
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore rules
├── LICENSE                     # MIT License
├── package.json                # Root package.json (scripts)
├── PROJECT_EXPLANATION.md      # This file
├── README.md                   # Project documentation
└── THEME_UPDATE.md            # Theme documentation

```

---

## ✨ Core Features

### 1. **Interactive Layer Visualization**
- **7 OSI Layers**: Application, Presentation, Session, Transport, Network, Data Link, Physical
- **Real-time Animation**: Watch data flow through each layer
- **Color-coded Layers**: Each layer has a unique color for easy identification
- **Active State Indicators**: Visual feedback showing current processing layer

### 2. **Encapsulation & Decapsulation**
- **Sender Side**: Data moves down from Layer 7 to Layer 1 (encapsulation)
- **Receiver Side**: Data moves up from Layer 1 to Layer 7 (decapsulation)
- **Header Addition**: Each layer adds protocol-specific headers
- **Header Removal**: Headers are removed during decapsulation

### 3. **Packet Visualization**
- **Animated Packet**: Shows packet structure with all headers
- **Size Tracking**: Displays packet size changes at each layer
- **Header Details**: View individual header information
- **Visual Stacking**: Headers stack visually as they're added

### 4. **Live Statistics Dashboard**
- **Elapsed Time**: Real-time transmission time tracking
- **Current Layer**: Shows which layer is processing
- **Packet Size**: Displays current packet size in bytes
- **Transmission Speed**: Calculates data transfer rate
- **Overhead Percentage**: Shows protocol overhead
- **Efficiency Metrics**: Data efficiency calculations
- **Progress Bar**: Visual progress indicator

### 5. **Data Transformation View**
- **ASCII Representation**: Original message in text format
- **Hexadecimal View**: Binary representation of data
- **Header Breakdown**: Detailed view of each layer's headers
- **Size Comparison**: Before and after transformation

### 6. **Binary Visualization**
- **Binary Stream**: Shows data as 1s and 0s
- **Signal Waveform**: Digital signal representation
- **Bit Rate Display**: Transmission speed in bps
- **Encoding Method**: Shows encoding technique (Manchester)
- **Physical Medium**: Displays transmission medium type

### 7. **Error Simulation**
- **Random Errors**: Simulate network errors at any layer
- **Layer-specific Errors**: Different error types per layer
  - Physical: Signal interference
  - Data Link: Frame collision, CRC errors
  - Network: Packet loss, routing errors
  - Transport: Connection timeout
  - Session: Session timeout
  - Presentation: Decryption failure
  - Application: Server errors
- **Error Recovery**: Automatic retry and recovery mechanisms
- **Visual Feedback**: Error modals with detailed information

### 8. **Simulation Controls**
- **Pause/Resume**: Control simulation flow
- **Speed Control**: Adjust animation speed (0.5x, 1x, 1.5x, 2x)
- **Reset**: Restart simulation
- **Enable/Disable Features**: Toggle error simulation and binary view

### 9. **Layer Details Modal**
- **Comprehensive Information**: Detailed layer specifications
- **Protocol Details**: Protocol names and functions
- **Header Information**: Header size and structure
- **Interactive Visualization**: Layer-specific animations
- **External Simulations**: iFrame integration for detailed simulations

### 10. **Theme Support**
- **Dark Theme**: Professional black background with blue accents
- **Light Theme**: Clean white background (optional)
- **Glassmorphism**: Modern glass-effect UI elements
- **Smooth Transitions**: Animated theme switching

---

## 🧩 Component Breakdown

### Main Components

#### **App.jsx**
- **Purpose**: Main application container and orchestrator
- **Responsibilities**:
  - State management for entire application
  - Simulation phase control
  - API communication
  - Theme management
  - Error handling
- **Key States**:
  - `message`: User input message
  - `layers`: OSI layer data
  - `packetData`: Packet information
  - `simulation`: Simulation state (phase, layer, speed)
  - `darkMode`: Theme preference

#### **LayerCard.jsx**
- **Purpose**: Display individual OSI layer
- **Props**:
  - `layer`: Layer data (name, protocol, function)
  - `isActive`: Current processing state
  - `isCompleted`: Completion state
  - `onClick`: Click handler for details
  - `darkMode`: Theme mode
- **Features**:
  - Hover animations
  - Active state highlighting
  - Progress indicator
  - Color-coded borders

#### **AnimatedPacket.jsx**
- **Purpose**: Visualize packet structure with headers
- **Props**:
  - `packetData`: Packet information
  - `currentLayer`: Current layer number
  - `phase`: Simulation phase
  - `darkMode`: Theme mode
- **Features**:
  - Dynamic header stacking
  - Size calculations
  - Animated transitions
  - Color-coded headers

#### **LiveStats.jsx**
- **Purpose**: Real-time statistics dashboard
- **Props**:
  - `phase`: Current simulation phase
  - `currentLayer`: Active layer
  - `packetData`: Packet data
  - `startTime`: Simulation start timestamp
  - `darkMode`: Theme mode
- **Metrics**:
  - Elapsed time
  - Current layer
  - Packet size
  - Transmission speed
  - Overhead percentage
  - Efficiency rating

#### **SimulationModal.jsx**
- **Purpose**: Detailed layer information modal
- **Props**:
  - `layer`: Layer data
  - `onClose`: Close handler
- **Features**:
  - Layer specifications
  - Interactive visualizations
  - Protocol details
  - External simulation iFrame
  - Responsive design

#### **DataTransformationView.jsx**
- **Purpose**: Show data transformation at each layer
- **Props**:
  - `message`: Original message
  - `currentLayer`: Active layer
  - `phase`: Simulation phase
  - `darkMode`: Theme mode
- **Features**:
  - ASCII representation
  - Hexadecimal view
  - Header breakdown
  - Size comparison

#### **BinaryVisualization.jsx**
- **Purpose**: Display binary data at physical layer
- **Props**:
  - `message`: Message to convert
  - `isActive`: Animation state
  - `darkMode`: Theme mode
- **Features**:
  - Binary stream display
  - Signal waveform
  - Bit rate calculation
  - Encoding information

#### **ErrorSimulation.jsx**
- **Purpose**: Display and handle network errors
- **Props**:
  - `layer`: Layer where error occurred
  - `onResolve`: Error resolution callback
- **Features**:
  - Layer-specific error messages
  - Recovery animations
  - Error details
  - Resolution button

### Custom Hooks

#### **useSimulation.js**
- **Purpose**: Manage simulation state and timing
- **Returns**:
  - `phase`: Current simulation phase
  - `currentLayer`: Active layer number
  - `isPaused`: Pause state
  - `speed`: Animation speed
  - `startTime`: Start timestamp
  - `setPhase`, `setCurrentLayer`, etc.: State setters
  - `wait`: Async delay function
  - `reset`: Reset simulation
- **Features**:
  - Centralized state management
  - Speed-adjusted delays
  - Pause/resume support

### Services

#### **api.js**
- **Purpose**: API communication layer
- **Methods**:
  - `getLayers()`: Fetch OSI layer data
  - `transmitMessage(message)`: Simulate message transmission
- **Features**:
  - Axios-based HTTP client
  - Environment-based API URL
  - Error handling
  - Response transformation

---

## 🔄 Data Flow

### 1. **Application Initialization**
```
User Opens App
    ↓
App.jsx Mounts
    ↓
useEffect Triggers
    ↓
API Call: GET /api/layers
    ↓
Backend Returns Layer Data
    ↓
State Updated: setLayers(data)
    ↓
UI Renders Layer Cards
```

### 2. **Message Transmission Simulation**
```
User Enters Message
    ↓
User Clicks "Send Message"
    ↓
startSimulation() Called
    ↓
API Call: POST /api/transmit
    ↓
Backend Calculates Packet Data
    ↓
Frontend Receives Packet Info
    ↓
┌─────────────────────────────────┐
│   ENCAPSULATION PHASE           │
│   Layer 7 → Layer 1             │
│   - Add headers at each layer   │
│   - Animate packet growth       │
│   - Update live stats           │
│   - Simulate errors (optional)  │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│   TRANSMISSION PHASE            │
│   - Show binary data            │
│   - Animate transmission        │
│   - Display medium info         │
└─────────────────────────────────┘
    ↓
┌─────────────────────────────────┐
│   DECAPSULATION PHASE           │
│   Layer 1 → Layer 7             │
│   - Remove headers at each layer│
│   - Animate packet shrinking    │
│   - Update live stats           │
│   - Simulate errors (optional)  │
└─────────────────────────────────┘
    ↓
Simulation Complete
    ↓
Display Success Message
```

### 3. **Error Simulation Flow**
```
Error Enabled + Random Trigger
    ↓
simulateError(layerId) Called
    ↓
ErrorSimulation Modal Appears
    ↓
Display Layer-Specific Error
    ↓
Show Recovery Animation
    ↓
User Clicks "Error Resolved"
    ↓
Modal Closes
    ↓
Simulation Continues
```

---

## 🌐 API Endpoints

### Backend API (Express.js)

#### **GET /api/layers**
- **Description**: Retrieve all OSI layer information
- **Response**:
```json
{
  "layers": [
    {
      "id": 7,
      "name": "Application Layer",
      "protocol": "HTTP, FTP, SMTP, DNS",
      "function": "Network process to application",
      "color": "#ef4444",
      "headerAdded": "HTTP Header",
      "headerSize": 0,
      "simulationUrl": "https://group7-application-layer-sim.com"
    },
    // ... other layers
  ]
}
```

#### **POST /api/transmit**
- **Description**: Simulate message transmission and calculate packet data
- **Request Body**:
```json
{
  "message": "Hello, World!"
}
```
- **Response**:
```json
{
  "message": "Hello, World!",
  "originalSize": 13,
  "finalSize": 239,
  "totalOverhead": 226,
  "overheadPercentage": "94.56",
  "estimatedTime": "8.4",
  "layers": [
    {
      "id": 7,
      "headerSize": 0,
      "totalSize": 13
    },
    // ... other layers
  ]
}
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js**: Version 14.0.0 or higher
- **npm**: Version 6.0.0 or higher
- **Git**: For cloning the repository

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/osi-simulator.git
cd osi-simulator
```

#### 2. Install All Dependencies
```bash
npm run install:all
```
This command installs dependencies for:
- Root project
- Frontend
- Backend

#### 3. Configure Environment Variables

**Frontend (.env.development)**
```env
VITE_API_URL=http://localhost:5000
```

**Frontend (.env.production)**
```env
VITE_API_URL=https://your-production-api.com
```

**Backend (.env)**
```env
PORT=5000
NODE_ENV=development
```

#### 4. Start Development Servers
```bash
npm run dev
```
This starts both frontend (port 5173) and backend (port 5000) concurrently.

#### 5. Access the Application
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 📖 Usage Guide

### Basic Usage

1. **Enter a Message**
   - Type your message in the input field (max 100 characters)
   - The character count updates in real-time

2. **Configure Simulation**
   - Enable/disable error simulation
   - Enable/disable binary visualization

3. **Start Simulation**
   - Click "Send Message" button
   - Watch the encapsulation process (Sender side)
   - Observe transmission through the medium
   - See decapsulation process (Receiver side)

4. **Control Simulation**
   - **Pause**: Freeze the animation
   - **Resume**: Continue from where you paused
   - **Speed**: Adjust animation speed (0.5x to 2x)
   - **Reset**: Start over with a new message

5. **Explore Layer Details**
   - Click any layer card to open detailed modal
   - View protocol information
   - See interactive visualizations
   - Access external simulations

### Advanced Features

#### Error Simulation
- Enable "Error Simulation" checkbox
- Random errors occur at 25% probability
- Each layer has specific error types
- Click "Error Resolved" to continue

#### Binary Visualization
- Enable "Show Binary Visualization"
- Appears at Physical Layer (Layer 1)
- Shows binary stream and waveform
- Displays transmission statistics

#### Live Statistics
- Monitor real-time metrics
- Track transmission progress
- View packet size changes
- Calculate efficiency

---

## 🎨 Customization

### Theme Customization

#### Tailwind Configuration (`tailwind.config.js`)
```javascript
theme: {
  extend: {
    colors: {
      'professional': {
        dark: '#000000',        // Main background
        darker: '#000000',      // Deeper backgrounds
        accent: '#1e40af',      // Primary accent
        'accent-light': '#3b82f6',  // Light accent
        'accent-dark': '#1e3a8a',   // Dark accent
      }
    }
  }
}
```

#### Custom CSS Utilities (`index.css`)
```css
.glass-effect {
  background: rgba(30, 64, 175, 0.15);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.professional-card {
  background: linear-gradient(135deg, rgba(30, 64, 175, 0.2) 0%, rgba(30, 58, 138, 0.15) 100%);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(59, 130, 246, 0.4);
  box-shadow: 0 8px 32px rgba(30, 64, 175, 0.3);
}
```

### Layer Customization

#### Modify Layer Data (`backend/routes/api.js`)
```javascript
const osiLayers = [
  {
    id: 7,
    name: "Your Custom Layer Name",
    protocol: "Your Protocols",
    function: "Your Function Description",
    color: "#yourcolor",
    headerAdded: "Your Header",
    headerSize: 20,
    simulationUrl: "https://your-simulation-url.com"
  },
  // ... more layers
]
```

### Animation Customization

#### Adjust Speeds (`config/constants.js`)
```javascript
export const ANIMATION_SPEEDS = {
  SLOW: 2000,
  NORMAL: 1200,
  FAST: 600,
  VERY_FAST: 300
}
```

---

## 🚢 Deployment

### Frontend Deployment (Vercel/Netlify)

#### Build for Production
```bash
cd frontend
npm run build
```

#### Deploy to Vercel
```bash
vercel --prod
```

#### Deploy to Netlify
```bash
netlify deploy --prod --dir=dist
```

### Backend Deployment (Heroku/Railway)

#### Prepare for Deployment
1. Ensure `package.json` has start script
2. Set environment variables
3. Configure CORS for production domain

#### Deploy to Heroku
```bash
cd backend
heroku create your-app-name
git push heroku main
```

#### Deploy to Railway
```bash
railway login
railway init
railway up
```

### Environment Variables

**Production Frontend**
```env
VITE_API_URL=https://your-backend-api.com
```

**Production Backend**
```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-domain.com
```

---

## 🔧 Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 5000
npx kill-port 5000

# Or use different port
PORT=5001 npm start
```

#### CORS Errors
- Check backend CORS configuration
- Verify frontend API URL
- Ensure credentials are included

#### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Learning Resources

### OSI Model
- [OSI Model Explained](https://www.cloudflare.com/learning/ddos/glossary/open-systems-interconnection-model-osi/)
- [Network Protocols](https://www.geeksforgeeks.org/layers-of-osi-model/)

### Technologies Used
- [React Documentation](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Express.js](https://expressjs.com/)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Sarth Narola**

- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- OSI Model concept by ISO
- React and Vite communities
- Tailwind CSS team
- Framer Motion developers
- All contributors and users

---

## 📞 Support

For support, email your.email@example.com or open an issue on GitHub.

---

**Version**: 2.0.0  
**Last Updated**: December 2024  
**Status**: Production Ready ✅
