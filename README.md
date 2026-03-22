# 🧭 Conflict Compass

**Conflict Compass** is an advanced, open-source Geopolitical OSINT (Open-Source Intelligence) Dashboard. It provides a real-time, tactical visualization of global conflicts, civilian tracked data, and active threat radii on an interactive dark-mode map.

Developed independently by [**Prathmesh Mutke**](https://github.com/PrathmeshMutke).

🌍 **[Live Demo Available Here](https://PrathmeshMutke.github.io/conflict-compass/)**

---

## ✨ Features

- **Live FlightRadar Integration**: Fetches real-time, live coordinates for civilian aircraft directly from the OpenSky Network REST API every 30 seconds.
- **Tactical Intel Feed**: A constantly updating, scrollable feed of recent geopolitical events (mocked intelligence including Airstrikes, Drones, Missiles, and Interceptions).
- **Interactive Threat Radii**: Click on any intel event to instantly visualize a pulsating radar ring indicating its potential blast zone or scanning perimeter.
- **Global INTEL Search**: A blazing-fast search engine built right above the map to instantly filter out specific event IDs or city targets.
- **OSINT Dark Mode Theme**: Designed completely from scratch with a glassmorphic neon aesthetic, CartoDB Dark Matter tactical map tiles, and custom sub-pixel tracking animations.
- **Marine Traffic Ready**: Includes architectural support for plotting and tracking `vessels` (ships) along global trade routes.

## 🚀 Getting Started

### Prerequisites

You need `Node.js` (v18+) and `npm` installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PrathmeshMutke/conflict-compass.git
   cd conflict-compass
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open the Dashboard:** Navigating to `http://localhost:8080/`

## 🛠️ Tech Stack

- **Framework**: `React 18` + `Vite`
- **Mapping**: `Leaflet` & `react-leaflet` with `CartoDB Dark Matter` Tiles
- **Styling**: `TailwindCSS` + Custom Keyframe Animations
- **UI Components**: `shadcn/ui` + `Radix UI` Primitive Components
- **Data Layers**: Custom Mock INTEL engine + **[OpenSky Network REST API]**

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! If you have a real-time AIS Marine Traffic API key, feel free to open a PR to patch the simulated vessel feeds.

## 📝 License

This project is licensed under the MIT License.
