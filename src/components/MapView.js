import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import L from 'leaflet';
import { X, Layers, MapPin, Menu, LayoutDashboard, FileText, LogOut, User, Search, Loader2 } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../context/ThemeContext';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Map layers configuration
const mapLayers = {
  plain: {
    name: 'Street',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors',
    preview: 'https://a.tile.openstreetmap.org/12/2048/1256.png'
  },
  terrain: {
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap contributors',
    preview: 'https://a.tile.opentopomap.org/12/2048/1256.png'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri',
    preview: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/12/1256/2048'
  },
  dark: {
    name: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© CartoDB',
    preview: 'https://a.basemaps.cartocdn.com/dark_all/12/2048/1256.png'
  }
};

// Component to handle map events and location
const MapController = ({ onLocationFound }) => {
  const map = useMap();
  const [locationSet, setLocationSet] = useState(false);

  useEffect(() => {
    if (!locationSet && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 13);
          onLocationFound({ lat: latitude, lng: longitude });
          setLocationSet(true);
        },
        (error) => {
          console.error('Error getting location:', error);
          map.setView([40.7128, -74.0060], 13); // Default to NYC
          onLocationFound({ lat: 40.7128, lng: -74.0060 });
          setLocationSet(true);
        }
      );
    }
  }, [map, onLocationFound, locationSet]);

  return null;
};

const MapView = ({ user }) => {
  const { isDarkMode } = useTheme();
  const [currentLayer, setCurrentLayer] = useState(isDarkMode ? 'dark' : 'plain');
  const [showLayerSelector, setShowLayerSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const mapRef = useRef();

  useEffect(() => {
    setCurrentLayer(isDarkMode ? 'dark' : 'plain');
  }, [isDarkMode]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLocationFound = (location) => {
    // setUserLocation(location);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
    // Implement search logic here if needed
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Hide Leaflet attribution link */}
      <style>
        {`
          .leaflet-control-attribution {
            display: none !important;
          }
        `}
      </style>

      {/* Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`absolute top-4 left-4 z-[1000] p-3 rounded-xl glass hover:bg-white/90 dark:hover:bg-gray-800/90 shadow-lg transition-all duration-300 ${sidebarOpen ? 'translate-x-80' : 'translate-x-0'
          }`}
      >
        {sidebarOpen ? <X className="h-6 w-6 text-gray-700 dark:text-gray-200" /> : <Menu className="h-6 w-6 text-gray-700 dark:text-gray-200" />}
      </button>

      {/* Sidebar */}
      <div className={`absolute top-0 left-0 h-full w-80 glass z-[999] transform transition-transform duration-300 ease-in-out border-r border-white/20 dark:border-gray-700 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className="p-6 border-b border-white/20 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img src="/Logo_transparent.png" alt="Logo" className="h-8 w-auto" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">Mapify OS</span>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link to="/dashboard" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-primary-600 dark:hover:text-primary-400 transition-all">
            <LayoutDashboard className="h-5 w-5" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400">
            <MapPin className="h-5 w-5" />
            <span className="font-medium">Interactive Map</span>
          </div>
          <Link to="/docs" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-white/50 dark:hover:bg-gray-800/50 hover:text-primary-600 dark:hover:text-primary-400 transition-all">
            <FileText className="h-5 w-5" />
            <span className="font-medium">Documentation</span>
          </Link>
        </nav>

        <div className="p-6 border-t border-white/20 dark:border-gray-700 bg-white/30 dark:bg-gray-900/30 backdrop-blur-md">
          <div className="flex items-center space-x-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary-500 to-secondary-500 p-0.5">
              <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                <User className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </div>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.displayName || user.email?.split('@')[0]}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <button onClick={handleSignOut} className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm font-medium">
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Floating Search Bar */}
      <div className={`absolute top-4 left-20 z-[900] transition-all duration-300 ${sidebarOpen ? 'translate-x-[320px]' : 'translate-x-0'}`}>
        <div className="relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
          <form onSubmit={handleSearch} className="relative flex items-center glass rounded-full px-4 py-2 bg-white/80 dark:bg-gray-900/80 shadow-lg w-12 hover:w-80 group-hover:w-80 focus-within:w-80 transition-all duration-500 ease-out overflow-hidden h-12">
            <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 flex-shrink-0 cursor-pointer" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places..."
              className="ml-3 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 w-full opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-300 delay-100"
            />
            {loading && <Loader2 className="h-4 w-4 text-primary-500 animate-spin absolute right-4" />}
          </form>
        </div>
      </div>

      {/* Layer Selector - Floating Bottom Right */}
      <div className="absolute bottom-8 right-8 z-[1000]">
        <div className="relative">
          {showLayerSelector && (
            <div className="absolute bottom-16 right-0 glass p-2 rounded-2xl shadow-xl space-y-2 w-48 animate-slide-up bg-white/90 dark:bg-gray-900/90 mb-2">
              {Object.entries(mapLayers).map(([key, layer]) => (
                <button
                  key={key}
                  onClick={() => {
                    setCurrentLayer(key);
                    setShowLayerSelector(false);
                  }}
                  className={`flex items-center w-full p-2 rounded-xl transition-colors ${currentLayer === key
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                    }`}
                >
                  <img src={layer.preview} alt={layer.name} className="w-8 h-8 rounded-lg object-cover mr-3 border border-gray-200 dark:border-gray-700" />
                  <span className="text-sm font-medium">{layer.name}</span>
                  {currentLayer === key && <div className="ml-auto w-2 h-2 rounded-full bg-primary-500"></div>}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setShowLayerSelector(!showLayerSelector)}
            className="p-4 rounded-full glass bg-white dark:bg-gray-800 shadow-xl hover:scale-110 transition-transform duration-200 group flex items-center justify-center"
          >
            <Layers className="h-6 w-6 text-gray-700 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
          </button>
        </div>
      </div>

      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={13}
        className="h-full w-full outline-none z-0"
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution={mapLayers[currentLayer].attribution}
          url={mapLayers[currentLayer].url}
        />
        <MapController onLocationFound={handleLocationFound} />
      </MapContainer>
    </div>
  );
};

export default MapView;
