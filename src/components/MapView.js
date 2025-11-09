import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import L from 'leaflet';
import { Search, X, Layers, MapPin, Navigation, Menu, LayoutDashboard, FileText, LogOut, User, Home, Plus, Minus } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

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
    name: 'Plain',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap contributors'
  },
  terrain: {
    name: 'Terrain',
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '© OpenTopoMap contributors'
  },
  satellite: {
    name: 'Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '© Esri'
  },
  dark: {
    name: 'Dark',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '© CartoDB'
  }
};

// Component to handle map events and location
const MapController = ({ onLocationFound, searchResults, onMarkerClick }) => {
  const map = useMap();
  const [locationSet, setLocationSet] = useState(false);

  // Function to get place information from coordinates
  const getPlaceInfo = async (lat, lng) => {
    try {
      // First, get basic address info from Nominatim reverse geocoding
      const nominatimResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      );
      const nominatimData = await nominatimResponse.json();

      // Then, get detailed tags from Overpass API
      const overpassQuery = `
        [out:json][timeout:10];
        (
          way(around:10,${lat},${lng});
          node(around:10,${lat},${lng});
          relation(around:10,${lat},${lng});
        );
        out tags;
      `;

      const overpassResponse = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`
      });
      const overpassData = await overpassResponse.json();

      // Find the most relevant element with useful tags
      const relevantElement = overpassData.elements.find(element => 
        element.tags && (
          element.tags.name || 
          element.tags.amenity || 
          element.tags.shop || 
          element.tags.building ||
          element.tags.leisure ||
          element.tags.tourism
        )
      );

      return {
        nominatim: nominatimData,
        overpass: relevantElement
      };
    } catch (error) {
      console.error('Error fetching place info:', error);
      return null;
    }
  };

  // Function to format category/type
  const formatCategory = (tags) => {
    if (!tags) return null;
    
    const categoryMap = {
      amenity: tags.amenity,
      shop: tags.shop,
      building: tags.building,
      leisure: tags.leisure,
      tourism: tags.tourism,
      highway: tags.highway,
      office: tags.office,
      craft: tags.craft
    };

    for (const [key, value] of Object.entries(categoryMap)) {
      if (value) {
        return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    }
    return null;
  };

  // Function to create popup content
  const createPopupContent = (placeInfo) => {
    if (!placeInfo) {
      return `
        <div class="p-3 min-w-64">
          <div class="text-center text-gray-500">
            <p class="text-sm">No information available for this location</p>
          </div>
        </div>
      `;
    }

    const { nominatim, overpass } = placeInfo;
    const tags = overpass?.tags || {};
    
    // Extract information
    const placeName = tags.name || nominatim.name || nominatim.display_name?.split(',')[0] || 'Unknown Location';
    const category = formatCategory(tags);
    const fullAddress = nominatim.display_name || 'Address not available';
    const phone = tags.phone || tags['contact:phone'];
    const website = tags.website || tags['contact:website'] || tags.url;
    const openingHours = tags.opening_hours;
    
    // Build address for copying
    let copyableAddress = '';
    if (tags['addr:housenumber'] && tags['addr:street']) {
      copyableAddress = `${tags['addr:housenumber']} ${tags['addr:street']}`;
      if (tags['addr:city']) copyableAddress += `, ${tags['addr:city']}`;
      if (tags['addr:postcode']) copyableAddress += ` ${tags['addr:postcode']}`;
    } else {
      copyableAddress = fullAddress;
    }

    let content = `
      <div class="p-3 min-w-64 max-w-80">
        <!-- Place Name -->
        <h3 class="font-bold text-lg text-gray-900 mb-2 leading-tight">${placeName}</h3>
        
        <!-- Category -->
        ${category ? `<div class="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mb-3">${category}</div>` : ''}
        
        <!-- Full Address -->
        <div class="mb-3">
          <p class="text-sm text-gray-600 leading-relaxed">${fullAddress}</p>
        </div>
        
        <!-- Contact Information -->
        <div class="space-y-2 mb-3">
    `;

    // Phone
    if (phone) {
      content += `
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          <a href="tel:${phone}" class="text-sm text-blue-600 hover:underline">${phone}</a>
        </div>
      `;
    }

    // Website
    if (website) {
      const displayUrl = website.replace(/^https?:\/\//, '').replace(/\/$/, '');
      content += `
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
          </svg>
          <a href="${website}" target="_blank" class="text-sm text-blue-600 hover:underline">${displayUrl}</a>
        </div>
      `;
    }

    // Opening Hours
    if (openingHours) {
      content += `
        <div class="flex items-start space-x-2">
          <svg class="w-4 h-4 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-sm text-gray-600">${openingHours}</span>
        </div>
      `;
    }

    content += `
        </div>
        
        <!-- Copy Address Button -->
        <div class="pt-2 border-t border-gray-200">
          <button 
            onclick="navigator.clipboard.writeText('${copyableAddress.replace(/'/g, "\\'")}').then(() => {
              const btn = event.target;
              const originalText = btn.textContent;
              btn.textContent = 'Copied!';
              btn.classList.add('bg-green-100', 'text-green-800');
              btn.classList.remove('bg-gray-100', 'text-gray-700');
              setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('bg-green-100', 'text-green-800');
                btn.classList.add('bg-gray-100', 'text-gray-700');
              }, 2000);
            })"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span>Copy Address</span>
          </button>
        </div>
      </div>
    `;

    return content;
  };

  useEffect(() => {
    // Only set location once when component mounts
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
          // Default to New York if location access is denied
          map.setView([40.7128, -74.0060], 13);
          onLocationFound({ lat: 40.7128, lng: -74.0060 });
          setLocationSet(true);
        }
      );
    }

    // Add click handler for map
    const handleMapClick = async (e) => {
      const { lat, lng } = e.latlng;
      
      // Show loading popup
      const loadingPopup = L.popup()
        .setLatLng([lat, lng])
        .setContent(`
          <div class="p-3 min-w-48">
            <div class="flex items-center space-x-2">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span class="text-sm text-gray-600">Fetching place info…</span>
            </div>
          </div>
        `)
        .openOn(map);

      // Get place information
      const placeInfo = await getPlaceInfo(lat, lng);
      
      // Update popup with actual content
      const content = createPopupContent(placeInfo);
      loadingPopup.setContent(content);
    };

    map.on('click', handleMapClick);

    // Cleanup
    return () => {
      map.off('click', handleMapClick);
    };
  }, [map, onLocationFound, locationSet]);

  return null;
};

const MapView = ({ user }) => {
  const [currentLayer, setCurrentLayer] = useState('plain');
  const [showLayerSelector, setShowLayerSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mapRef = useRef();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleLocationFound = (location) => {
    setUserLocation(location);
  };

  // Function to format category/type
  const formatCategory = (tags) => {
    if (!tags) return null;
    
    const categoryMap = {
      amenity: tags.amenity,
      shop: tags.shop,
      building: tags.building,
      leisure: tags.leisure,
      tourism: tags.tourism,
      highway: tags.highway,
      office: tags.office,
      craft: tags.craft
    };

    for (const [key, value] of Object.entries(categoryMap)) {
      if (value) {
        return value.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    }
    return null;
  };

  // Enhanced popup content for search results with API data
  const createEnhancedPopupContent = (placeInfo) => {
    const { nominatim, overpass, searchResult } = placeInfo;
    const tags = overpass?.tags || {};
    
    // Use search result data as primary, enhance with API data
    const placeName = searchResult.name || tags.name || nominatim.name || 'Unknown Location';
    const category = formatCategory(tags) || searchResult.type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const fullAddress = nominatim.display_name || searchResult.address || 'Address not available';
    const phone = tags.phone || tags['contact:phone'] || searchResult.phone;
    const website = tags.website || tags['contact:website'] || tags.url || searchResult.website;
    const openingHours = tags.opening_hours;
    
    // Build address for copying
    let copyableAddress = '';
    if (tags['addr:housenumber'] && tags['addr:street']) {
      copyableAddress = `${tags['addr:housenumber']} ${tags['addr:street']}`;
      if (tags['addr:city']) copyableAddress += `, ${tags['addr:city']}`;
      if (tags['addr:postcode']) copyableAddress += ` ${tags['addr:postcode']}`;
    } else {
      copyableAddress = fullAddress;
    }

    let content = `
      <div class="p-3 min-w-64 max-w-80">
        <!-- Place Name -->
        <h3 class="font-bold text-lg text-gray-900 mb-2 leading-tight">${placeName}</h3>
        
        <!-- Category -->
        ${category ? `<div class="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mb-3">${category}</div>` : ''}
        
        <!-- Full Address -->
        <div class="mb-3">
          <p class="text-sm text-gray-600 leading-relaxed">${fullAddress}</p>
        </div>
        
        <!-- Contact Information -->
        <div class="space-y-2 mb-3">
    `;

    // Phone
    if (phone) {
      content += `
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          <a href="tel:${phone}" class="text-sm text-blue-600 hover:underline">${phone}</a>
        </div>
      `;
    }

    // Website
    if (website) {
      const displayUrl = website.replace(/^https?:\/\//, '').replace(/\/$/, '');
      content += `
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
          </svg>
          <a href="${website}" target="_blank" class="text-sm text-blue-600 hover:underline">${displayUrl}</a>
        </div>
      `;
    }

    // Opening Hours
    if (openingHours) {
      content += `
        <div class="flex items-start space-x-2">
          <svg class="w-4 h-4 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span class="text-sm text-gray-600">${openingHours}</span>
        </div>
      `;
    }

    content += `
        </div>
        
        <!-- Copy Address Button -->
        <div class="pt-2 border-t border-gray-200">
          <button 
            onclick="navigator.clipboard.writeText('${copyableAddress.replace(/'/g, "\\'")}').then(() => {
              const btn = event.target;
              const originalText = btn.textContent;
              btn.textContent = 'Copied!';
              btn.classList.add('bg-green-100', 'text-green-800');
              btn.classList.remove('bg-gray-100', 'text-gray-700');
              setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('bg-green-100', 'text-green-800');
                btn.classList.add('bg-gray-100', 'text-gray-700');
              }, 2000);
            })"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span>Copy Address</span>
          </button>
        </div>
      </div>
    `;

    return content;
  };

  // Basic popup content fallback for search results
  const createBasicPopupContent = (result) => {
    const category = result.type?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    let content = `
      <div class="p-3 min-w-64 max-w-80">
        <!-- Place Name -->
        <h3 class="font-bold text-lg text-gray-900 mb-2 leading-tight">${result.name}</h3>
        
        <!-- Category -->
        ${category ? `<div class="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full mb-3">${category}</div>` : ''}
        
        <!-- Address -->
        ${result.address ? `
        <div class="mb-3">
          <p class="text-sm text-gray-600 leading-relaxed">${result.address}</p>
        </div>
        ` : ''}
        
        <!-- Contact Information -->
        <div class="space-y-2 mb-3">
    `;

    // Phone
    if (result.phone) {
      content += `
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
          </svg>
          <a href="tel:${result.phone}" class="text-sm text-blue-600 hover:underline">${result.phone}</a>
        </div>
      `;
    }

    // Website
    if (result.website) {
      const displayUrl = result.website.replace(/^https?:\/\//, '').replace(/\/$/, '');
      content += `
        <div class="flex items-center space-x-2">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
          </svg>
          <a href="${result.website}" target="_blank" class="text-sm text-blue-600 hover:underline">${displayUrl}</a>
        </div>
      `;
    }

    content += `
        </div>
        
        <!-- Copy Address Button -->
        ${result.address ? `
        <div class="pt-2 border-t border-gray-200">
          <button 
            onclick="navigator.clipboard.writeText('${result.address.replace(/'/g, "\\'")}').then(() => {
              const btn = event.target;
              const originalText = btn.textContent;
              btn.textContent = 'Copied!';
              btn.classList.add('bg-green-100', 'text-green-800');
              btn.classList.remove('bg-gray-100', 'text-gray-700');
              setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('bg-green-100', 'text-green-800');
                btn.classList.add('bg-gray-100', 'text-gray-700');
              }, 2000);
            })"
            class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 px-3 rounded-md transition-colors flex items-center justify-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span>Copy Address</span>
          </button>
        </div>
        ` : ''}
      </div>
    `;

    return content;
  };

  const searchNearbyPOIs = async () => {
    if (!searchQuery.trim() || !userLocation) return;

    setLoading(true);
    try {
      // Parse search query to determine POI type
      const query = searchQuery.toLowerCase();
      let poiType = 'amenity';
      
      if (query.includes('hospital')) poiType = 'hospital';
      else if (query.includes('pharmacy')) poiType = 'pharmacy';
      else if (query.includes('clinic')) poiType = 'clinic';
      else if (query.includes('restaurant')) poiType = 'restaurant';
      else if (query.includes('gas') || query.includes('fuel')) poiType = 'fuel';
      else if (query.includes('bank')) poiType = 'bank';
      else if (query.includes('school')) poiType = 'school';

      // Use Overpass API to search for nearby POIs within 2km radius
      const overpassQuery = `
        [out:json][timeout:25];
        (
          node["amenity"="${poiType}"](around:2000,${userLocation.lat},${userLocation.lng});
          way["amenity"="${poiType}"](around:2000,${userLocation.lat},${userLocation.lng});
          relation["amenity"="${poiType}"](around:2000,${userLocation.lat},${userLocation.lng});
        );
        out center;
      `;

      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `data=${encodeURIComponent(overpassQuery)}`
      });

      const data = await response.json();
      
      const results = data.elements
        .filter(element => element.lat && element.lon)
        .map(element => ({
          id: element.id,
          name: element.tags?.name || `${poiType.charAt(0).toUpperCase() + poiType.slice(1)}`,
          type: element.tags?.amenity || poiType,
          lat: element.lat || element.center?.lat,
          lng: element.lon || element.center?.lon,
          address: element.tags?.['addr:full'] || element.tags?.['addr:street'] || '',
          phone: element.tags?.phone || '',
          website: element.tags?.website || ''
        }))
        .slice(0, 20); // Limit to 20 results

      setSearchResults(results);
    } catch (error) {
      console.error('Error searching POIs:', error);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchNearbyPOIs();
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedMarker(null);
  };

  const handleMarkerClick = async (result) => {
    setSelectedMarker(result);
    
    // Navigate to the selected location on the map with better zoom
    if (mapRef.current && result.lat && result.lng) {
      // First animate to the location with a good zoom level
      mapRef.current.setView([result.lat, result.lng], 18, {
        animate: true,
        duration: 1.2
      });
      
      // Wait for animation to complete, then show detailed popup
      setTimeout(async () => {
        // Create a more detailed popup using the existing place info system
        const loadingPopup = L.popup()
          .setLatLng([result.lat, result.lng])
          .setContent(`
            <div class="p-3 min-w-48">
              <div class="flex items-center space-x-2">
                <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span class="text-sm text-gray-600">Loading details…</span>
              </div>
            </div>
          `)
          .openOn(mapRef.current);

        // Get detailed place information
        try {
          // Use the same APIs as the click handler
          const nominatimResponse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${result.lat}&lon=${result.lng}&zoom=18&addressdetails=1`
          );
          const nominatimData = await nominatimResponse.json();

          const overpassQuery = `
            [out:json][timeout:10];
            (
              way(around:10,${result.lat},${result.lng});
              node(around:10,${result.lat},${result.lng});
              relation(around:10,${result.lat},${result.lng});
            );
            out tags;
          `;

          const overpassResponse = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `data=${encodeURIComponent(overpassQuery)}`
          });
          const overpassData = await overpassResponse.json();

          const relevantElement = overpassData.elements.find(element => 
            element.tags && (
              element.tags.name === result.name ||
              element.tags.amenity || 
              element.tags.shop || 
              element.tags.building ||
              element.tags.leisure ||
              element.tags.tourism
            )
          );

          // Create enhanced popup content combining search result and API data
          const placeInfo = {
            nominatim: nominatimData,
            overpass: relevantElement,
            searchResult: result // Include original search result data
          };

          const content = createEnhancedPopupContent(placeInfo);
          loadingPopup.setContent(content);
          
        } catch (error) {
          console.error('Error fetching detailed place info:', error);
          // Fallback to basic search result info
          const basicContent = createBasicPopupContent(result);
          loadingPopup.setContent(basicContent);
        }
      }, 1200); // Wait for map animation to complete
    }
  };

  return (
    <div className="relative h-screen">
      {/* Hide Leaflet attribution link */}
      <style>
        {`
          .leaflet-control-attribution {
            display: none !important;
          }
          .leaflet-bottom.leaflet-right {
            display: none !important;
          }
        `}
      </style>
      {/* Sidebar Toggle/Close Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`absolute top-4 z-[1100] bg-white w-[60px] h-[60px] rounded-full shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 flex items-center justify-center transition-all duration-300 ${
          sidebarOpen ? 'left-[336px]' : 'left-4'
        }`}
      >
        {sidebarOpen ? (
          <X className="h-5 w-5 text-gray-700" />
        ) : (
          <Menu className="h-5 w-5 text-gray-700" />
        )}
      </button>

      {/* Sidebar */}
      <div className={`absolute top-0 left-0 h-full w-80 bg-white shadow-xl z-[1050] transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="flex items-center justify-center p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <img 
                src="/Logo_transparent.png" 
                alt="Mapify OS Logo" 
                className="h-8 w-auto"
              />
              <span className="text-xl font-bold text-gray-900">Mapify OS</span>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 p-6">
            <nav className="space-y-2">
              <Link
                to="/dashboard"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <LayoutDashboard className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>

              <div className="flex items-center space-x-3 px-3 py-2 rounded-md bg-primary-100 text-primary-700">
                <MapPin className="h-5 w-5" />
                <span>Map</span>
              </div>

              <Link
                to="/documentation"
                className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                onClick={() => setSidebarOpen(false)}
              >
                <FileText className="h-5 w-5" />
                <span>SDK Documentation</span>
              </Link>
            </nav>
          </div>

          {/* User Info & Sign Out */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-gray-100 p-2 rounded-full">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              <span className="text-sm text-gray-700">{user.email}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="absolute inset-0 bg-black bg-opacity-50 z-[1040]"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Animated Search Bar */}
      <div className="absolute top-4 left-20 z-[1000]">
        <form onSubmit={handleSearch}>
          <div className="p-5 overflow-hidden w-[60px] h-[60px] hover:w-[270px] bg-white shadow-[2px_2px_20px_rgba(0,0,0,0.08)] rounded-full flex group items-center hover:duration-300 duration-300">
            <div className="flex items-center justify-center fill-black">
              {loading ? (
                <div className="animate-spin rounded-full h-[22px] w-[22px] border-2 border-black border-t-transparent"></div>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" id="Isolation_Mode" data-name="Isolation Mode" viewBox="0 0 24 24" width={22} height={22}>
                  <path d="M18.9,16.776A10.539,10.539,0,1,0,16.776,18.9l5.1,5.1L24,21.88ZM10.5,18A7.5,7.5,0,1,1,18,10.5,7.507,7.507,0,0,1,10.5,18Z" />
                </svg>
              )}
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hospitals, pharmacies, clinics..."
              className="outline-none text-[16px] bg-transparent w-full text-black font-normal px-4 placeholder-gray-500"
              disabled={loading}
            />
          </div>
        </form>
      </div>

      {/* Layer Selector */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <div className="relative">
          <button
            onClick={() => setShowLayerSelector(!showLayerSelector)}
            className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <Layers className="h-5 w-5 text-gray-700" />
          </button>
          
          {showLayerSelector && (
            <div className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
              <div className="p-2">
                <div className="text-sm font-medium text-gray-700 mb-2">Map Layers</div>
                {Object.entries(mapLayers).map(([key, layer]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setCurrentLayer(key);
                      setShowLayerSelector(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                      currentLayer === key
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {layer.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results Panel */}
      {searchResults.length > 0 && (
        <div className="absolute bottom-4 left-20 w-80 max-h-96 bg-white rounded-lg shadow-lg border border-gray-200 z-[1000] overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Search Results</h3>
          </div>
          <div className="overflow-y-auto max-h-80">
            {searchResults.map((result) => (
              <div
                key={result.id}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedMarker?.id === result.id ? 'bg-primary-50' : ''
                }`}
                onClick={() => handleMarkerClick(result)}
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {result.name}
                    </h4>
                    <p className="text-sm text-gray-500 capitalize">
                      {result.type}
                    </p>
                    {result.address && (
                      <p className="text-xs text-gray-400 mt-1">
                        {result.address}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map */}
      <MapContainer
        ref={mapRef}
        center={[40.7128, -74.0060]}
        zoom={13}
        style={{ 
          height: '100%', 
          width: '100%'
        }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url={mapLayers[currentLayer].url}
          attribution=""
        />
        
        <MapController
          onLocationFound={handleLocationFound}
          searchResults={searchResults}
          onMarkerClick={handleMarkerClick}
        />

        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]}>
            <Popup>
              <div className="text-center">
                <Navigation className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <div className="font-medium">Your Location</div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Search result markers */}
        {searchResults.map((result) => (
          <Marker
            key={result.id}
            position={[result.lat, result.lng]}
            eventHandlers={{
              click: () => handleMarkerClick(result)
            }}
          >
            <Popup>
              <div className="min-w-0">
                <h3 className="font-medium text-gray-900">{result.name}</h3>
                <p className="text-sm text-gray-500 capitalize">{result.type}</p>
                {result.address && (
                  <p className="text-xs text-gray-400 mt-1">{result.address}</p>
                )}
                {result.phone && (
                  <p className="text-xs text-gray-600 mt-1">
                    <strong>Phone:</strong> {result.phone}
                  </p>
                )}
                {result.website && (
                  <a
                    href={result.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:text-primary-800 mt-1 block"
                  >
                    Visit Website
                  </a>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Custom Zoom Controls */}
      <div className="absolute bottom-4 left-4 z-[1000] flex flex-col space-y-2">
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.zoomIn();
            }
          }}
          className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          title="Zoom In"
        >
          <Plus className="h-5 w-5 text-gray-700" />
        </button>
        <button
          onClick={() => {
            if (mapRef.current) {
              mapRef.current.zoomOut();
            }
          }}
          className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
          title="Zoom Out"
        >
          <Minus className="h-5 w-5 text-gray-700" />
        </button>
      </div>
    </div>
  );
};

export default MapView;
