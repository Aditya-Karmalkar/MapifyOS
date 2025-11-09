import React, { useState } from 'react';
import { Copy, ExternalLink, Code, Book, Zap, Shield } from 'lucide-react';

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

  const codeExamples = {
    basic: `<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://mapifysdk.netlify.app/v1/mapify.js"></script>
</head>
<body>
  <div id="map" style="height: 500px;"></div>
  
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <Book className="h-8 w-8 mr-3 text-blue-600" />
              SDK Documentation
            </h1>
            <p className="mt-2 text-gray-600">
              Learn how to integrate Mapify OS into your applications
            </p>
          </div>

          {/* Quick Start */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                Quick Start
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-blue-600 font-bold">1</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Get API Key</h3>
                  <p className="text-sm text-gray-600">Generate your API key from the dashboard</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-green-600 font-bold">2</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Include SDK</h3>
                  <p className="text-sm text-gray-600">Add Leaflet and Mapify OS scripts</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                    <span className="text-purple-600 font-bold">3</span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">Initialize</h3>
                  <p className="text-sm text-gray-600">Create your map with one function call</p>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 relative">
                <button
                  onClick={() => copyToClipboard(codeExamples.basic, 'basic')}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                  title="Copy code"
                >
                  <Copy className="h-4 w-4" />
                </button>
                {copiedCode === 'basic' && (
                  <span className="absolute top-4 right-12 text-green-400 text-sm">Copied!</span>
                )}
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  <code>{codeExamples.basic}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">🗺️ Interactive Maps</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Multiple map layers (Plain, Terrain, Satellite, Dark)</li>
                  <li>• Click anywhere for place details</li>
                  <li>• Responsive design for all devices</li>
                  <li>• Smooth animations and interactions</li>
                </ul>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">🔍 Search & Discovery</h3>
              </div>
              <div className="p-6">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Search for hospitals, restaurants, and more</li>
                  <li>• Customizable search radius</li>
                  <li>• Real-time results with markers</li>
                  <li>• Detailed place information</li>
                </ul>
              </div>
            </div>
          </div>

          {/* API Reference */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Code className="h-5 w-5 mr-2 text-green-500" />
                API Reference
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {/* MapifyOS.init */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">MapifyOS.init(containerId, options)</h3>
                  <p className="text-gray-600 mb-4">Initialize a new map instance in the specified container.</p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Parameters:</h4>
                    <div className="space-y-2 text-sm">
                      <div><code className="bg-gray-200 px-2 py-1 rounded">containerId</code> <span className="text-gray-600">(string) - DOM element ID</span></div>
                      <div><code className="bg-gray-200 px-2 py-1 rounded">options.apiKey</code> <span className="text-gray-600">(string, required) - Your API key</span></div>
                      <div><code className="bg-gray-200 px-2 py-1 rounded">options.center</code> <span className="text-gray-600">(array, optional) - Initial center [lat, lng]</span></div>
                      <div><code className="bg-gray-200 px-2 py-1 rounded">options.zoom</code> <span className="text-gray-600">(number, optional) - Initial zoom level</span></div>
                      <div><code className="bg-gray-200 px-2 py-1 rounded">options.layer</code> <span className="text-gray-600">(string, optional) - Map layer type</span></div>
                    </div>
                  </div>

                  <div className="bg-gray-900 rounded-lg p-4 relative">
                    <button
                      onClick={() => copyToClipboard(codeExamples.search, 'search')}
                      className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    {copiedCode === 'search' && (
                      <span className="absolute top-4 right-12 text-green-400 text-sm">Copied!</span>
                    )}
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{codeExamples.search}</code>
                    </pre>
                  </div>
                </div>

                {/* Event Handling */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Event Handling</h3>
                  <p className="text-gray-600 mb-4">Listen to map events for custom functionality.</p>
                  
                  <div className="bg-gray-900 rounded-lg p-4 relative">
                    <button
                      onClick={() => copyToClipboard(codeExamples.events, 'events')}
                      className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                    {copiedCode === 'events' && (
                      <span className="absolute top-4 right-12 text-green-400 text-sm">Copied!</span>
                    )}
                    <pre className="text-sm text-gray-300 overflow-x-auto">
                      <code>{codeExamples.events}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Security & Best Practices */}
          <div className="bg-white shadow rounded-lg mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-red-500" />
                Security & Best Practices
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">🔐 API Key Security</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Never expose API keys in client-side code for production</li>
                    <li>• Use environment variables for sensitive data</li>
                    <li>• Regularly rotate your API keys</li>
                    <li>• Monitor usage in the dashboard</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-3">⚡ Performance Tips</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Initialize maps only when needed</li>
                    <li>• Limit search radius for better performance</li>
                    <li>• Use appropriate zoom levels</li>
                    <li>• Clean up map instances when done</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Examples & Resources */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">📚 Examples & Resources</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a
                  href="/sdk/examples/basic.html"
                  target="_blank"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Basic Example</h3>
                      <p className="text-sm text-gray-600 mt-1">Simple map initialization</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </a>

                <a
                  href="/sdk/examples/search.html"
                  target="_blank"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">Search Example</h3>
                      <p className="text-sm text-gray-600 mt-1">Search functionality demo</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </a>

                <a
                  href="https://github.com/mapifyos/sdk"
                  target="_blank"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">GitHub Repository</h3>
                      <p className="text-sm text-gray-600 mt-1">Source code and issues</p>
                    </div>
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;
