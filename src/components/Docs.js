import React, { useState } from 'react';
import { Code, Copy, ExternalLink, Play, Book, Zap, Globe, Key } from 'lucide-react';

const Docs = () => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeTab, setActiveTab] = useState('quickstart');

  const copyToClipboard = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const CodeBlock = ({ code, language, id, title }) => (
    <div className="bg-gray-900 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800">
        <span className="text-sm text-gray-300">{title}</span>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center space-x-1 text-gray-400 hover:text-white transition-colors"
        >
          <Copy className="h-4 w-4" />
          <span className="text-xs">{copiedCode === id ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className={`language-${language} text-sm text-gray-100`}>
          {code}
        </code>
      </pre>
    </div>
  );

  const quickStartCode = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Map App</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
        #map { height: 400px; width: 100%; }
    </style>
</head>
<body>
    <h1>My Location Map</h1>
    <div id="map"></div>
    
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://api.mapifyos.com/v1/mapify.js"></script>
    <script>
        // Initialize Mapify with your API key
        const mapify = new MapifyOS({
            apiKey: 'YOUR_API_KEY_HERE',
            container: 'map',
            center: [40.7128, -74.0060], // New York
            zoom: 13
        });
        
        // Add a marker
        mapify.addMarker({
            lat: 40.7128,
            lng: -74.0060,
            popup: 'Hello from Mapify OS!'
        });
    </script>
</body>
</html>`;

  const reactCode = `import React, { useEffect, useRef } from 'react';
import { MapifyOS } from '@mapifyos/react';

const MyMapComponent = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const mapify = new MapifyOS({
      apiKey: 'YOUR_API_KEY_HERE',
      container: mapRef.current,
      center: [40.7128, -74.0060],
      zoom: 13,
      style: 'mapify-light' // or 'mapify-dark', 'satellite'
    });

    // Add search functionality
    mapify.enableSearch({
      placeholder: 'Search for places...',
      onResult: (result) => {
        console.log('Search result:', result);
        mapify.flyTo(result.coordinates, 16);
      }
    });

    // Add click handler for place info
    mapify.on('click', async (e) => {
      const placeInfo = await mapify.getPlaceInfo(e.latlng);
      mapify.showPopup(e.latlng, placeInfo);
    });

    return () => mapify.destroy();
  }, []);

  return (
    <div>
      <h2>My React Map</h2>
      <div ref={mapRef} style={{ height: '400px', width: '100%' }} />
    </div>
  );
};

export default MyMapComponent;`;

  const vueCode = `<template>
  <div>
    <h2>My Vue Map</h2>
    <div ref="mapContainer" class="map-container"></div>
  </div>
</template>

<script>
import { MapifyOS } from '@mapifyos/vue';

export default {
  name: 'MyMapComponent',
  data() {
    return {
      map: null
    };
  },
  mounted() {
    this.initMap();
  },
  beforeUnmount() {
    if (this.map) {
      this.map.destroy();
    }
  },
  methods: {
    initMap() {
      this.map = new MapifyOS({
        apiKey: 'YOUR_API_KEY_HERE',
        container: this.$refs.mapContainer,
        center: [40.7128, -74.0060],
        zoom: 13
      });

      // Add multiple markers
      const locations = [
        { lat: 40.7128, lng: -74.0060, title: 'New York' },
        { lat: 40.7589, lng: -73.9851, title: 'Times Square' },
        { lat: 40.6892, lng: -74.0445, title: 'Statue of Liberty' }
      ];

      locations.forEach(location => {
        this.map.addMarker({
          lat: location.lat,
          lng: location.lng,
          popup: location.title
        });
      });
    }
  }
};
</script>

<style scoped>
.map-container {
  height: 400px;
  width: 100%;
}
</style>`;

  const apiExamples = `// Search for nearby places
const searchResults = await mapify.search({
  query: 'restaurants near me',
  radius: 2000, // 2km radius
  limit: 20
});

// Get detailed place information
const placeInfo = await mapify.getPlaceInfo({
  lat: 40.7128,
  lng: -74.0060
});

// Add custom markers with icons
mapify.addMarker({
  lat: 40.7128,
  lng: -74.0060,
  icon: {
    url: 'https://example.com/custom-icon.png',
    size: [32, 32]
  },
  popup: {
    title: 'Custom Location',
    content: 'This is a custom marker with detailed info',
    actions: [
      { label: 'Get Directions', action: () => mapify.getDirections() }
    ]
  }
});

// Change map style dynamically
mapify.setStyle('satellite'); // 'light', 'dark', 'satellite', 'terrain'

// Listen to map events
mapify.on('moveend', (e) => {
  console.log('Map moved to:', e.center);
});

mapify.on('zoom', (e) => {
  console.log('Zoom level:', e.zoom);
});

// Get user's current location
mapify.getUserLocation()
  .then(location => {
    mapify.flyTo([location.lat, location.lng], 16);
    mapify.addMarker({
      lat: location.lat,
      lng: location.lng,
      popup: 'You are here!'
    });
  })
  .catch(error => {
    console.error('Location access denied:', error);
  });`;

  const installationCode = `# Install via npm
npm install @mapifyos/core

# Or via CDN
<script src="https://api.mapifyos.com/v1/mapify.js"></script>

# React package
npm install @mapifyos/react

# Vue package  
npm install @mapifyos/vue

# Angular package
npm install @mapifyos/angular`;

  const tabs = [
    { id: 'quickstart', label: 'Quick Start', icon: Zap },
    { id: 'react', label: 'React', icon: Code },
    { id: 'vue', label: 'Vue.js', icon: Code },
    { id: 'api', label: 'API Reference', icon: Book },
    { id: 'examples', label: 'Examples', icon: Play }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Globe className="h-8 w-8 text-primary-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Mapify OS Documentation</h1>
                <p className="text-sm text-gray-600">Integrate maps into your applications with ease</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/dashboard"
                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
              >
                <Key className="h-4 w-4" />
                <span>Get API Key</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-900 mb-4">Documentation</h3>
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 text-primary-700'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'quickstart' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Start Guide</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Get started with Mapify OS in minutes. Add interactive maps to your website with just a few lines of code.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">1. Get Your API Key</h3>
                  <p className="text-gray-600 mb-4">
                    First, you'll need an API key. Sign up and generate one from your dashboard.
                  </p>
                  <a
                    href="/dashboard"
                    className="inline-flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                  >
                    <Key className="h-4 w-4" />
                    <span>Generate API Key</span>
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">2. Installation</h3>
                  <CodeBlock
                    code={installationCode}
                    language="bash"
                    id="installation"
                    title="Installation Options"
                  />
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">3. Basic HTML Example</h3>
                  <p className="text-gray-600 mb-4">
                    Here's a complete HTML example to get you started:
                  </p>
                  <CodeBlock
                    code={quickStartCode}
                    language="html"
                    id="quickstart-html"
                    title="index.html"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="font-medium text-blue-900 mb-2">🎉 That's it!</h4>
                  <p className="text-blue-800">
                    You now have a fully functional map with search capabilities, place information, and multiple map layers.
                    Replace <code className="bg-blue-100 px-1 rounded">YOUR_API_KEY_HERE</code> with your actual API key.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'react' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">React Integration</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Use Mapify OS in your React applications with our dedicated React package.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Installation</h3>
                  <CodeBlock
                    code="npm install @mapifyos/react"
                    language="bash"
                    id="react-install"
                    title="Install React Package"
                  />
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">React Component Example</h3>
                  <CodeBlock
                    code={reactCode}
                    language="javascript"
                    id="react-component"
                    title="MyMapComponent.jsx"
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-medium text-green-900 mb-2">✨ Features Included</h4>
                  <ul className="text-green-800 space-y-1">
                    <li>• Automatic cleanup on component unmount</li>
                    <li>• TypeScript support</li>
                    <li>• React hooks integration</li>
                    <li>• Server-side rendering compatible</li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'vue' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Vue.js Integration</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Integrate Mapify OS seamlessly into your Vue.js applications.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Installation</h3>
                  <CodeBlock
                    code="npm install @mapifyos/vue"
                    language="bash"
                    id="vue-install"
                    title="Install Vue Package"
                  />
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Vue Component Example</h3>
                  <CodeBlock
                    code={vueCode}
                    language="javascript"
                    id="vue-component"
                    title="MyMapComponent.vue"
                  />
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">API Reference</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Complete API documentation with examples for all available methods and events.
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Core Methods</h3>
                  <CodeBlock
                    code={apiExamples}
                    language="javascript"
                    id="api-methods"
                    title="API Examples"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Map Methods</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li><code>setCenter(lat, lng)</code> - Set map center</li>
                      <li><code>setZoom(level)</code> - Set zoom level</li>
                      <li><code>flyTo(coords, zoom)</code> - Animate to location</li>
                      <li><code>setStyle(style)</code> - Change map style</li>
                      <li><code>getBounds()</code> - Get current map bounds</li>
                    </ul>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h4 className="font-semibold text-gray-900 mb-3">Marker Methods</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li><code>addMarker(options)</code> - Add marker</li>
                      <li><code>removeMarker(id)</code> - Remove marker</li>
                      <li><code>clearMarkers()</code> - Clear all markers</li>
                      <li><code>updateMarker(id, options)</code> - Update marker</li>
                      <li><code>getMarkers()</code> - Get all markers</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'examples' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Live Examples</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Interactive examples showing different use cases and features.
                  </p>
                </div>

                <div className="grid gap-6">
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Store Locator</h3>
                      <p className="text-gray-600">Find nearby stores with search and filtering</p>
                    </div>
                    <div className="h-64 bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Interactive demo would be here</p>
                        <button className="mt-2 text-primary-600 hover:text-primary-700">
                          View Code →
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Real-time Tracking</h3>
                      <p className="text-gray-600">Track vehicles or deliveries in real-time</p>
                    </div>
                    <div className="h-64 bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Interactive demo would be here</p>
                        <button className="mt-2 text-primary-600 hover:text-primary-700">
                          View Code →
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900">Property Listings</h3>
                      <p className="text-gray-600">Display properties with detailed popups</p>
                    </div>
                    <div className="h-64 bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Interactive demo would be here</p>
                        <button className="mt-2 text-primary-600 hover:text-primary-700">
                          View Code →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;
