# 🌐 OSI Layer Simulator - Professional Edition

A production-ready, interactive web application that visualizes data flow through the 7 layers of the OSI (Open Systems Interconnection) model. Built with modern web technologies for educational and demonstration purposes.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg)
![Node](https://img.shields.io/badge/Node-14%2B-339933.svg)

## ✨ Features

### Core Functionality
- **Real-time Visualization**: Watch data encapsulation and decapsulation in real-time
- **Interactive Layer Details**: Click on any layer to view detailed protocol information
- **Bidirectional Flow**: Visualize both sender and receiver sides simultaneously
- **Live Statistics Dashboard**: Track transmission metrics, speed, overhead, and efficiency

### Advanced Features
- **Error Simulation**: Practice network troubleshooting with random error injection
- **Binary Visualization**: See actual binary data at the physical layer
- **Adjustable Speed Controls**: Control simulation speed (0.5x to 2x)
- **Pause/Resume**: Full control over simulation playback
- **Dark/Light Theme**: Professional UI with theme switching
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Data Transformation View**: Track how data changes at each layer
- **Packet Size Tracking**: Monitor overhead and efficiency in real-time

## 🏗️ Architecture

```
osi-simulator/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── services/        # API service layer
│   │   ├── config/          # Configuration constants
│   │   ├── App.jsx          # Main application component
│   │   └── main.jsx         # Application entry point
│   ├── .env.development     # Development environment variables
│   ├── .env.production      # Production environment variables
│   └── package.json
├── backend/                  # Express.js backend API
│   ├── server.js            # API server
│   └── package.json
└── package.json             # Root package configuration
```

## 🚀 Quick Start

### Prerequisites
- Node.js 14.x or higher
- npm 6.x or higher

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd osi-simulator
```

2. **Install all dependencies**
```bash
npm run install:all
```

This will install dependencies for the root, frontend, and backend.

### Development

**Start both frontend and backend simultaneously:**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

**Or start them separately:**

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

### Production Build

```bash
# Build frontend for production
cd frontend
npm run build

# Preview production build
npm run preview
```

## 📖 Usage Guide

### Basic Simulation
1. Enter a message (up to 100 characters)
2. Click "Send Message" to start the simulation
3. Watch as data flows through all 7 OSI layers
4. View the final delivery confirmation with statistics

### Advanced Controls
- **Error Simulation**: Enable to randomly inject network errors
- **Binary View**: Enable to see binary representation at physical layer
- **Speed Control**: Adjust simulation speed during playback
- **Pause/Resume**: Control simulation flow at any time
- **Layer Details**: Click any layer card to view detailed information

### Understanding the Visualization

**Sender Side (Left)**
- Shows encapsulation process (Layer 7 → Layer 1)
- Each layer adds its header/trailer

**Transmission Medium (Center)**
- Displays packet structure and size
- Shows binary transmission at physical layer

**Receiver Side (Right)**
- Shows decapsulation process (Layer 1 → Layer 7)
- Each layer removes its header/trailer

## 🎨 Customization

### Theme
Toggle between dark and light themes using the theme button in the header.

### API Configuration
Edit environment files to change API endpoints:
- `.env.development` - Development API URL
- `.env.production` - Production API URL

### Layer Configuration
Modify `backend/server.js` to customize:
- Layer protocols
- Header sizes
- Layer colors
- Simulation URLs

## 📊 API Endpoints

### GET `/api/dataflow/layers`
Returns all OSI layer information.

**Response:**
```json
{
  "success": true,
  "layers": [...]
}
```

### POST `/api/dataflow/transmit`
Simulates data transmission through OSI layers.

**Request:**
```json
{
  "message": "Hello, World!"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Hello, World!",
  "originalSize": 13,
  "finalSize": 229,
  "totalOverhead": 216,
  "overheadPercentage": "94.3",
  "packetFlow": [...],
  "estimatedTime": 18.8
}
```

### GET `/api/dataflow/packet/:layer`
Returns specific layer information.

## 🛠️ Technology Stack

### Frontend
- **React 18.2** - UI framework
- **Framer Motion** - Animation library
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Vite** - Build tool and dev server

### Backend
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development auto-reload

## 🧪 Testing

The application includes comprehensive error handling and validation:
- Message length validation (1-100 characters)
- API error handling with user feedback
- Network error simulation for testing
- Responsive design testing across devices

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Sarth Narola**

## 🙏 Acknowledgments

- OSI Model specification by ISO
- React and Vite communities
- Tailwind CSS team
- Framer Motion developers

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the development team

## 🗺️ Roadmap

- [ ] Add WebSocket support for real-time multi-user simulations
- [ ] Implement packet loss and retry mechanisms
- [ ] Add more protocol options (UDP, HTTPS, etc.)
- [ ] Create tutorial mode with guided walkthroughs
- [ ] Add export functionality for simulation results
- [ ] Implement custom layer configuration
- [ ] Add internationalization (i18n) support
- [ ] Create mobile app versions

---

**Built with ❤️ for network education and visualization**
