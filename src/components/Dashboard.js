import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, query, onSnapshot, doc, deleteDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { Key, Plus, Trash2, Copy, Eye, EyeOff, Map, ExternalLink, Activity } from 'lucide-react';

const Dashboard = ({ user }) => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState({});
  const [copiedKey, setCopiedKey] = useState(null);

  useEffect(() => {
    const fetchApiKeys = async () => {
      try {
        const keysRef = collection(db, 'apiKeys', user.uid, 'keys');
        const q = query(keysRef);

        const unsubscribe = onSnapshot(q, 
          (snapshot) => {
            const keys = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            }));
            setApiKeys(keys);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching API keys:', error);
            // Set loading to false even on error to prevent infinite loading
            setLoading(false);
            setApiKeys([]);
          }
        );

        return () => unsubscribe();
      } catch (error) {
        console.error('Error setting up API keys listener:', error);
        setLoading(false);
        setApiKeys([]);
      }
    };

    fetchApiKeys();
  }, [user.uid]);

  // S-01/A-02: Use backend Cloud Function instead of client-side key generation
  const generateApiKey = async () => {
    setGenerating(true);
    try {
      // Get Firebase ID token for authentication
      const idToken = await auth.currentUser.getIdToken();
      
      // Call the secure backend generateKey endpoint
      const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || '';
      const response = await fetch(`${apiBaseUrl}/generateKey`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: `API Key ${apiKeys.length + 1}` })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate API key');
      }
      
      // The real-time Firestore listener will automatically pick up the new key
      // No need to manually update state here
    } catch (error) {
      console.error('Error generating API key:', error);
      alert(`❌ Error generating API key: ${error.message}`);
    }
    setGenerating(false);
  };

  const deleteApiKey = async (keyId, keyName) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      `⚠️ Delete API Key "${keyName}"?\n\n` +
      `This action cannot be undone. Once deleted, this API key will be permanently removed and cannot be retrieved again.\n\n` +
      `Any applications using this key will stop working immediately.\n\n` +
      `Are you sure you want to continue?`
    );

    if (!confirmed) return;

    try {
      const keyRef = doc(db, 'apiKeys', user.uid, 'keys', keyId);
      await deleteDoc(keyRef);
      
      // Show success message
      alert('✅ API Key deleted successfully!\n\nThe key has been permanently removed from the database.');
    } catch (error) {
      console.error('Error deleting API key:', error);
      alert('❌ Error deleting API key. Please try again.');
    }
  };

  const copyToClipboard = async (key, keyId) => {
    try {
      await navigator.clipboard.writeText(key);
      setCopiedKey(keyId);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const toggleKeyVisibility = (keyId) => {
    setVisibleKeys(prev => ({
      ...prev,
      [keyId]: !prev[keyId]
    }));
  };

  const formatKey = (key, keyId) => {
    if (visibleKeys[keyId]) {
      return key;
    }
    return key.substring(0, 8) + '•'.repeat(24) + key.substring(key.length - 4);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Manage your API keys and explore the map interface
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Link
              to="/map"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Map className="h-8 w-8 text-primary-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Explore Maps
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        Open Interactive Map
                      </dd>
                    </dl>
                  </div>
                  <div className="flex-shrink-0">
                    <ExternalLink className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </Link>

            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Activity className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        Total API Calls
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {apiKeys.reduce((sum, key) => sum + key.usageCount, 0)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* API Keys Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">API Keys</h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Generate and manage API keys for your applications
                  </p>
                </div>
                <button
                  onClick={generateApiKey}
                  disabled={generating}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {generating ? 'Generating...' : 'Generate Key'}
                </button>
              </div>
            </div>

            <div className="px-6 py-4">
              {apiKeys.length === 0 ? (
                <div className="text-center py-12">
                  <Key className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No API keys</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by generating your first API key.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={generateApiKey}
                      disabled={generating}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Generate API Key
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <div
                      key={apiKey.id}
                      className={`border rounded-lg p-4 ${
                        apiKey.active ? 'border-gray-200 bg-white' : 'border-red-200 bg-red-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="text-sm font-medium text-gray-900">
                              {apiKey.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                apiKey.active
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {apiKey.active ? 'Active' : 'Revoked'}
                            </span>
                          </div>
                          <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                            <span>Created: {formatDate(apiKey.createdAt)}</span>
                            <span>Usage: {apiKey.usageCount} calls</span>
                          </div>
                          <div className="mt-3 flex items-center space-x-2">
                            <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                              {formatKey(apiKey.key, apiKey.id)}
                            </code>
                            <button
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              {visibleKeys[apiKey.id] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                              className="p-1 text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="h-4 w-4" />
                            </button>
                            {copiedKey === apiKey.id && (
                              <span className="text-xs text-green-600">Copied!</span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteApiKey(apiKey.id, apiKey.name)}
                          className="ml-4 p-2 text-red-400 hover:text-red-600"
                          title="Delete API Key"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SDK Documentation */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">SDK Integration</h2>
            </div>
            <div className="px-6 py-4">
              <div className="prose max-w-none">
                <h3 className="text-base font-medium text-gray-900">Quick Start</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Embed interactive maps in your website with just a few lines of code.
                </p>
                <div className="mt-4 bg-gray-900 rounded-lg p-4 text-white overflow-x-auto">
                  <code className="text-sm">
                    {`<!-- Include Leaflet CSS -->`}<br/>
                    {`<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />`}<br/><br/>
                    {`<!-- Include Leaflet JS -->`}<br/>
                    {`<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>`}<br/><br/>
                    {`<!-- Include Mapify OS SDK -->`}<br/>
                    {`<script src="https://mapifysdk.netlify.app/v1/mapify.js"></script>`}<br/><br/>
                    {`<!-- Create map container -->`}<br/>
                    {`<div id="map" style="height: 500px;"></div>`}<br/><br/>
                    {`<!-- Initialize map -->`}<br/>
                    {`<script>`}<br/>
                    {`  MapifyOS.init("map", {`}<br/>
                    {`    apiKey: "YOUR_API_KEY_HERE"`}<br/>
                    {`  });`}<br/>
                    {`</script>`}
                  </code>
                </div>
                <div className="mt-4 flex space-x-4">
                  <a 
                    href="/documentation" 
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                  >
                    📚 Full Documentation
                  </a>
                  <a 
                    href="https://mapifysdk.netlify.app" 
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-md hover:bg-gray-700"
                  >
                    🔗 SDK Homepage
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex justify-center space-x-6 text-sm text-gray-500">
              <Link to="/terms" className="hover:text-gray-700">Terms of Use</Link>
              <Link to="/privacy" className="hover:text-gray-700">Privacy Policy</Link>
              <Link to="/documentation" className="hover:text-gray-700">Documentation</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
