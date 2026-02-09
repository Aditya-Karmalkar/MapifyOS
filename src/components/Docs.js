import React, { useState } from 'react';
import { Copy, ExternalLink, Code, Book, Zap, Shield, Globe, Layers, Layout, Terminal, ArrowRight } from 'lucide-react';

const Docs = () => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeTab, setActiveTab] = useState('quickstart');

  const copyToClipboard = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const CodeBlock = ({ code, language, id, title }) => (
    <div className="relative group rounded-2xl overflow-hidden my-6 shadow-2xl border border-gray-700/50 bg-[#0d1117]">
      {/* Mac-style Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#161b22] border-b border-gray-700/50">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          {title && <span className="ml-3 text-xs font-mono text-gray-400 select-none">{title}</span>}
        </div>
        <button
          onClick={() => copyToClipboard(code, id)}
          className="flex items-center space-x-1.5 px-2 py-1 rounded-md text-gray-400 hover:text-white hover:bg-gray-700/50 transition-all duration-200"
        >
          {copiedCode === id ? (
            <>
              <span className="text-green-400 text-xs font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="p-5 overflow-x-auto bg-[#0d1117] relative">
        <code className={`font-mono text-sm text-gray-300 leading-relaxed block`}>
          {code.split('\n').map((line, i) => (
            <div key={i} className="table-row">
              <span className="table-cell text-right pr-4 select-none text-gray-700 w-8">{i + 1}</span>
              <span className="table-cell whitespace-pre">{line}</span>
            </div>
          ))}
        </code>
      </div>
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
        #map { height: 400px; width: 100%; border-radius: 12px; }
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

    return () => mapify.destroy();
  }, []);

  return (
    <div className="map-wrapper">
      <div ref={mapRef} style={{ height: '500px', width: '100%', borderRadius: '16px' }} />
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
  methods: {
    initMap() {
      this.map = new MapifyOS({
        apiKey: 'YOUR_API_KEY_HERE',
        container: this.$refs.mapContainer,
        center: [40.7128, -74.0060],
        zoom: 13
      });
    }
  }
}
</script>

<style scoped>
.map-container {
  height: 500px;
  width: 100%;
  border-radius: 16px;
}
</style>`;

  const features = [
    { icon: Globe, title: 'Global Coverage', desc: 'High-quality map data for the entire world.' },
    { icon: Zap, title: 'Wait-less Loading', desc: 'Vector tiles ensure blazing fast map rendering.' },
    { icon: Layers, title: 'Multi-Utility Layers', desc: 'Switch between street, satellite, dark, and terrain modes.' },
    { icon: Layout, title: 'Framework Ready', desc: 'Drop-in components for React, Vue, and Angular.' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in pb-20">

      {/* Hero Section - Matching Dashboard Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 to-secondary-600 p-8 shadow-xl text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-xl mb-4 backdrop-blur-sm border border-white/20">
              <Book className="h-6 w-6 text-white" />
              <span className="ml-2 font-medium">Developer Hub</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Documentation
            </h1>
            <p className="text-primary-50 opacity-90 max-w-2xl">
              Everything you need to build powerful location-based applications with Mapify OS.
              Integrate maps, search, and routing in minutes.
            </p>
          </div>
          {/* Optional: Add a hero image or code snippet graphic here if desired */}
        </div>
      </div>

      {/* Feature Cards - Matching Dashboard Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, idx) => (
          <div key={idx} className="group glass-card p-6 rounded-2xl hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary-500 to-secondary-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            <div className="mb-4">
              <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300 w-fit">
                <feature.icon className="h-6 w-6" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{feature.desc}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">

          {/* Quick Start Card */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Start Guide</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Get up and running in less than 5 minutes</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-8">
              {/* Step 1 */}
              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold border border-primary-200 dark:border-primary-700 group-hover:scale-110 transition-transform">1</div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Get your API Key</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">Create an account and generate a free API key from your dashboard to authenticate your requests.</p>
                  <a href="/dashboard" className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                    Go to Dashboard <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/50 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold border border-primary-200 dark:border-primary-700 group-hover:scale-110 transition-transform">2</div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Install the SDK</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Choose your preferred framework below:</p>

                  {/* Tab Navigation */}
                  <div className="flex space-x-2 bg-gray-100 dark:bg-gray-800/50 p-1.5 rounded-xl w-fit mb-4 border border-gray-200 dark:border-gray-700">
                    {['quickstart', 'react', 'vue'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab
                            ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-400 shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                          }`}
                      >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4">
                    {activeTab === 'quickstart' && (
                      <CodeBlock
                        title="index.html"
                        language="html"
                        id="quickstart"
                        code={quickStartCode}
                      />
                    )}
                    {activeTab === 'react' && (
                      <CodeBlock
                        title="MapComponent.jsx"
                        language="jsx"
                        id="react"
                        code={reactCode}
                      />
                    )}
                    {activeTab === 'vue' && (
                      <CodeBlock
                        title="MapComponent.vue"
                        language="html"
                        id="vue"
                        code={vueCode}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          <div className="glass-card p-1 rounded-2xl hover:shadow-lg transition-all duration-300">
            <div className="rounded-xl bg-gradient-to-br from-primary-600 to-secondary-700 p-6 text-white text-center relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl" />

              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Ready to Build?</h3>
                <p className="text-primary-100 mb-6 text-sm">Get your free API key and start creating amazing map experiences today.</p>
                <a href="/dashboard" className="block w-full py-3 px-4 bg-white text-primary-600 font-bold rounded-xl text-center shadow-lg hover:bg-primary-50 transition-all">
                  Go to Dashboard
                </a>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Shield className="h-5 w-5 mr-2 text-green-500" />
              Resources
            </h3>
            <div className="space-y-1">
              {[
                { label: 'API Reference', href: '#' },
                { label: 'Examples Gallery', href: '#' },
                { label: 'Community Forum', href: '#' }
              ].map((item, i) => (
                <a key={i} href={item.href} className="flex items-center p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary-600 dark:hover:text-primary-400 transition-all group">
                  <ExternalLink className="h-4 w-4 mr-2 opacity-50 group-hover:opacity-100" />
                  {item.label}
                  <ArrowRight className="h-3 w-3 ml-auto opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Docs;

