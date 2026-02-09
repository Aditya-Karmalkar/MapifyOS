import React, { useState } from 'react';
import { Copy, ExternalLink, Code, Book, Zap, Shield, Globe, Layers, Layout, Terminal, Key, ArrowRight } from 'lucide-react';

const Documentation = () => {
  const [copiedCode, setCopiedCode] = useState(null);

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

  const codeExamples = {
    basic: `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://mapifysdk.netlify.app/v1/mapify.js"></script>
</head>
<body>
  <div id="map" style="height: 500px; border-radius: 16px;"></div>
  
  <script>
    MapifyOS.init("map", {
      apiKey: "your-api-key-here",
      center: [40.7128, -74.0060],
      zoom: 13
    });
  </script>
</body>
</html>`,
    search: `// Search for nearby hospitals
const mapInstance = await MapifyOS.init("map", {
  apiKey: "your-api-key-here"
});

const results = await mapInstance.search("hospital", {
  center: [40.7128, -74.0060],
  radius: 3000 // 3km radius
});

console.log(\`Found \${results.length} hospitals\`);`,
    events: `// Listen to map events
mapInstance.on("placeClick", (data) => {
  console.log("Place clicked:", data.data.name);
});

mapInstance.on("search", (data) => {
  console.log(\`Search for "\${data.query}" returned \${data.results.length} results\`);
});

mapInstance.on("layerChange", (data) => {
  console.log("Layer changed to:", data.layer);
});`
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8 animate-fade-in pb-20">

      {/* Hero Section - Matching Dashboard Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-8 shadow-xl text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-black/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center justify-center p-2 bg-white/10 rounded-xl mb-4 backdrop-blur-sm border border-white/20">
              <Terminal className="h-6 w-6 text-white" />
              <span className="ml-2 font-medium">SDK Reference</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
              Technical Documentation
            </h1>
            <p className="text-blue-50 opacity-90 max-w-2xl">
              Deep dive into the Mapify OS SDK. Learn about initialization, event handling, and advanced search with our comprehensive API reference.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">

          {/* Quick Start Card */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                  <Zap className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Start</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Essential steps to integrate Mapify OS</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:border-primary-200 dark:hover:border-primary-800 transition-colors">
                  <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl w-10 h-10 flex items-center justify-center mb-3">
                    <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Get API Key</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">From dashboard</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:border-green-200 dark:hover:border-green-800 transition-colors">
                  <div className="bg-green-100 dark:bg-green-900/30 rounded-2xl w-10 h-10 flex items-center justify-center mb-3">
                    <span className="text-green-600 dark:text-green-400 font-bold">2</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Include SDK</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Add script tags</p>
                </div>
                <div className="flex flex-col items-center text-center p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 hover:border-purple-200 dark:hover:border-purple-800 transition-colors">
                  <div className="bg-purple-100 dark:bg-purple-900/30 rounded-2xl w-10 h-10 flex items-center justify-center mb-3">
                    <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Initialize</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Create map</p>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-4">Basic Implementation</h4>
                <CodeBlock
                  title="index.html"
                  language="html"
                  id="basic"
                  code={codeExamples.basic}
                />
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-blue-300 dark:hover:border-blue-700 transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Globe className="h-24 w-24 text-blue-500" />
              </div>
              <Globe className="h-8 w-8 text-blue-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Interactive Maps</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start"><span className="mr-2 text-blue-500">•</span>Multiple map layers (Plain, Terrain, Satellite)</li>
                <li className="flex items-start"><span className="mr-2 text-blue-500">•</span>Click anywhere for place details</li>
                <li className="flex items-start"><span className="mr-2 text-blue-500">•</span>Responsive design for all devices</li>
                <li className="flex items-start"><span className="mr-2 text-blue-500">•</span>Smooth animations and interactions</li>
              </ul>
            </div>
            <div className="glass-card p-6 rounded-2xl relative overflow-hidden group hover:border-purple-300 dark:hover:border-purple-700 transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Layout className="h-24 w-24 text-purple-500" />
              </div>
              <Layout className="h-8 w-8 text-purple-500 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Search & Discovery</h3>
              <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                <li className="flex items-start"><span className="mr-2 text-purple-500">•</span>Search for hospitals, restaurants</li>
                <li className="flex items-start"><span className="mr-2 text-purple-500">•</span>Customizable search radius</li>
                <li className="flex items-start"><span className="mr-2 text-purple-500">•</span>Real-time results with markers</li>
                <li className="flex items-start"><span className="mr-2 text-purple-500">•</span>Detailed place information</li>
              </ul>
            </div>
          </div>

          {/* API Reference */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-xl">
                  <Code className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">API Reference</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Detailed methods and properties</p>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-10">

              {/* MapifyOS.init */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 flex items-center">
                  <span className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md font-mono text-sm mr-2 text-indigo-600 dark:text-indigo-400">function</span>
                  MapifyOS.init(containerId, options)
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">Initialize a new map instance in the specified container.</p>

                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 mb-6 border border-gray-100 dark:border-gray-700/50">
                  <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center text-sm uppercase tracking-wider">
                    <Terminal className="h-4 w-4 mr-2" />
                    Parameters
                  </h4>
                  <div className="space-y-4 text-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                      <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md font-mono whitespace-nowrap">containerId</span>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mr-2">String</span>
                        <span className="text-gray-600 dark:text-gray-300">DOM element ID where the map will be rendered.</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                      <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md font-mono whitespace-nowrap">options.apiKey</span>
                      <div>
                        <span className="text-red-500/80 text-xs uppercase font-bold mr-2">Required</span>
                        <span className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mr-2">String</span>
                        <span className="text-gray-600 dark:text-gray-300">Valid API key from your dashboard.</span>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                      <span className="bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-1 rounded-md font-mono whitespace-nowrap">options.center</span>
                      <div>
                        <span className="text-gray-500 dark:text-gray-400 text-xs uppercase font-bold mr-2">Array</span>
                        <span className="text-gray-600 dark:text-gray-300">Initial coordinates [lat, lng].</span>
                      </div>
                    </div>
                  </div>
                </div>

                <CodeBlock
                  title="search.js"
                  language="javascript"
                  id="search"
                  code={codeExamples.search}
                />
              </div>

              <div className="w-full h-px bg-gray-200 dark:bg-gray-700" />

              {/* Event Handling */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Event Handling</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">Listen to map events for custom functionality.</p>
                <CodeBlock
                  title="events.js"
                  language="javascript"
                  id="events"
                  code={codeExamples.events}
                />
              </div>
            </div>
          </div>

          {/* Security Section */}
          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                  <Shield className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Security & Best Practices</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Keep your application secure</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Key className="h-4 w-4 mr-2 text-indigo-500" />
                    API Key Security
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 mr-2"></div>
                      Never expose API keys in client-side code for production
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 mr-2"></div>
                      Use environment variables for sensitive data
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 mr-2"></div>
                      Regularly rotate your API keys
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 mr-2"></div>
                      Monitor usage in the dashboard
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                    <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                    Performance Tips
                  </h3>
                  <ul className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 mr-2"></div>
                      Initialize maps only when needed
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 mr-2"></div>
                      Limit search radius for better performance
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 mr-2"></div>
                      Use appropriate zoom levels to reduce tile loading
                    </li>
                    <li className="flex items-start">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1.5 mr-2"></div>
                      Clean up map instances when done
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-card p-1 rounded-2xl hover:shadow-lg transition-all duration-300">
            <div className="rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white text-center relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl" />

              <h3 className="text-xl font-bold mb-2 relative z-10">Need an API Key?</h3>
              <p className="text-blue-100 mb-6 text-sm relative z-10">
                Get started for free with our generous developer tier.
              </p>
              <button onClick={() => window.location.href = '/dashboard'} className="w-full bg-white text-blue-600 font-bold py-3 px-4 rounded-xl hover:bg-blue-50 transition-colors shadow-lg relative z-10">
                Get API Key
              </button>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <Book className="h-5 w-5 mr-2 text-gray-400" />
              Resources
            </h3>
            <div className="space-y-1">
              {[
                { label: 'API Reference', href: '#' },
                { label: 'Examples Gallery', href: '#' },
                { label: 'Community Support', href: '#' }
              ].map((item, i) => (
                <a key={i} href={item.href} className="flex items-center p-3 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-blue-600 dark:hover:text-blue-400 transition-all group">
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

export default Documentation;

